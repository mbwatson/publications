import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios'

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import CircularProgress from '@material-ui/core/CircularProgress';

import DoiForm from '../../components/Forms/DoiForm'
import StagedPublication from '../../components/Publications/StagedPublication'

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const styles = theme => ({
    root: {
        transition: 'width 250ms',
    },
    addButton: {
        color: '#fff',
        backgroundColor: '#00abc7',
        '&:hover': {
            backgroundColor: '#008b97',
        }
    },
    loading: {
        margin: 'auto',
    },
});

const fetchMetadata = async (doi) => {
    let url = `https://search.crossref.org/dois?q=${doi}`
    let data = await axios.get(url).then(response => {
        if (response.status !== 200) { return null }
        if (response.data.length === 0) { return null }
        return response.data[0]
    })
    return data
}

class Stage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            loading: false,
            publication: null,
            errorMessage: '',
        }
    }

    handleOpen = () => {
        this.setState({
            open: true,
        })
    }
    
    handleClose = () => {
        this.setState({
            open: false,
            publication: null,
            errorMessage: '',
        })
    }

    stagePublicationHandler = async (event) => {
        event.preventDefault()
        this.clearErrors()
        const doiInputField = document.querySelector('#addDoiInput')
        const doi = doiInputField.value.trim()
        if (doi === '') {
            this.setState({ errorMessage: 'No DOI was entered!' })
            return false
        }
        if (this.props.allDois.includes(doi)) {
            this.setState({ errorMessage: 'This publication is already in the database!' })
            return false
        }
        this.setState({ loading: true })
        let metadata = await fetchMetadata(doi)
        if (!metadata) {
            this.setState({
                errorMessage: 'There was an error fetching this publication!',
                loading: false,
            })
            return false
        }
        this.setState( {
            publication: {
                doi: doi,
                title: metadata.title,
                citation: metadata.fullCitation,
            },
            loading: false,
        })
    }

    postDOI = (doi) => {
        axios.post(this.props.apiUrl, {
        // axios.post('/api/publications/', {
            doi: doi
        }).then(response => {
            console.log(`Successfully posted publication with DOI ${doi}`)
        }).catch(error => {
            console.error(`Error posting publication with DOI ${doi}\nError ${error.response.status}: ${error.response.statusText}`)
        })
    }
    
    confirmPublicationHandler = async () => {
        if (this.state.publication) {
            const { publication } = this.state
            console.log(`Confirming publication ${publication.doi}.`)
            await this.postDOI(publication.doi)
            this.props.newPublicationEvent(publication)
            this.handleClose()
        }
    }
    
    clearErrors = () => {
        this.setState({ errorMessage: '' })
    }

    render() {
        const { classes } = this.props
        return (
            <div>
                <Tooltip title="Add Publication">
                    <Button variant="fab"
                        color="primary"
                        aria-label="Add"
                        className={ classes.addButton }
                        onClick={ this.handleOpen }>
                        <AddIcon />
                    </Button>
                </Tooltip>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="add-publication-title"
                    className={ classes.root }
                    scroll="body"
                 >
                    <DialogTitle id="add-publication-title">Add Publication</DialogTitle>
                        {
                            this.state.publication ? (
                                <React.Fragment>
                                    <DialogContent>
                                        <StagedPublication publication={ this.state.publication } />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={ this.handleClose } color="primary">Cancel</Button>
                                        <Button onClick={ this.confirmPublicationHandler } color="primary">Confirm</Button>
                                    </DialogActions>
                                </React.Fragment>
                            ) : (
                                this.state.loading ? (
                                    <DialogContent style={ { textAlign: 'center' } }>
                                        <CircularProgress className="loading" />
                                    </DialogContent>
                                ) : (
                                    <React.Fragment>
                                        <DialogContent>
                                            <DoiForm
                                                stagePublicationEvent={ this.stagePublicationHandler }
                                                errorMessage={ this.state.errorMessage }
                                                clearErrors={ this.clearErrors }
                                            />
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={ this.handleClose } color="primary">Cancel</Button>
                                        </DialogActions>
                                    </React.Fragment>
                                )
                            )
                        }
                </Dialog>
            </div>
        )
    }
}

export default withStyles(styles)(Stage)
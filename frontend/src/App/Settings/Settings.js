import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';

import { SettingsConsumer } from '../../contexts/SettingsContext'

import { Dialog, Button, Tooltip } from '@material-ui/core'
import { FormControl, FormControlLabel, FormLabel, RadioGroup, Radio, IconButton } from '@material-ui/core'
import { Settings as SettingsIcon } from '@material-ui/icons'

import { DialogContent, DialogTitle, DialogActions } from '@material-ui/core';

const styles = theme => ({
    formControl: { },
    group: { },
    radio: { },
    settingsButton: {
        marginRight: theme.spacing.unit,
        color: theme.palette.secondary.main,
        transition: 'color 250ms',
        '&:hover': {
            color: theme.palette.secondary.dark,
        }
    },
})

class Settings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            filterBy: 'any',
        }
    }

    componentDidMount() {
        this.setState({
            filterBy: 'any',
        })
    }

    openHandler = () => {
        this.setState({
            open: true,
        })
    }
    
    closeHandler = () => {
        this.setState({
            open: false,
        })
    }
    
    changeHandler = ( event ) => {
        // console.log(event.target.value)
        this.setState({
            filterBy: event.target.value
        })
        this.props.saveSettings(event.target.value)
    }

    sideNote = () => {
        let description
        switch(this.state.filterBy) {
            case 'any':
                description = `Display publications that contain any of the queried words.`
                break
            case 'all':
                description = `Display publications that contain all queried words.`
                break
            case 'exact':
                description = `Display publications matching the query string exactly.`
                break
            default:
                description = ``
                break
        }
        return description
    }

    render() {
        const { classes } = this.props
        let description = this.sideNote()
        return (
            <div>
                <Tooltip title="Search Settings">
                    <IconButton
                        color="primary"
                        aria-label="Search Settings"
                        className={ classes.settingsButton }
                        onClick={ this.openHandler }
                    >
                        <SettingsIcon />
                    </IconButton>
                </Tooltip>
                <SettingsConsumer>
                    {
                        ( context ) => (
                            <Dialog
                                open={ this.state.open }
                                onClose={ this.closeHandler }
                                aria-labelledby="settings-form"
                                className={ classes.root }
                                scroll="body"
                            >
                                <DialogTitle id="settings-form">Settings</DialogTitle>
                                <DialogContent>
                                    <FormLabel component="legend">Filter Settings</FormLabel>
                                    <FormControl component="fieldset" className={ classes.formControl }>
                                        <RadioGroup
                                            aria-label="Filter Options"
                                            name="filterOptions"
                                            className={ classes.group }
                                            value={ context.filterBy }
                                            onChange={ (event) => { context.saveSettings(event.target.value) } }
                                        >
                                            <FormControlLabel className={ classes.radio } value="any" control={ <Radio /> } label="Any" />
                                            <FormControlLabel className={ classes.radio } value="all" control={ <Radio /> } label="All" />
                                            <FormControlLabel className={ classes.radio } value="exact" control={ <Radio /> } label="Exact" />
                                        </RadioGroup>
                                    </FormControl>
                                </DialogContent>
                                <DialogContent>
                                    { description }
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={ this.closeHandler } color="primary">
                                        Close
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        )
                    }
                </SettingsConsumer>
            </div>
        )
    }
}

export default withStyles(styles)(Settings)

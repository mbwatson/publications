import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ListItemText from '@material-ui/core/ListItemText'
import DOILink from '../DOILink/DOILink'
import Grow from '@material-ui/core/Grow'

const styles = (theme) => ({
    root: {
        marginBottom: theme.spacing.unit,
    },
    primary: {
        color: '#222',
        fontSize: '1.1rem',
    },
    secondary: {
        color: '#999',
    },
    citation: {
        color: '#aaa',
        textAlign: 'left',
        cursor: 'text',
    },
    column: {
        flexBasis: '50%',
    },
    date: {
        flex: '1',
        textAlign: 'left',
    },
    link: {
        flex: '1',
        textAlign: 'right',
    },
})

const publication = ( props ) => {
    const { classes } = props
    const visible = true
    return (
        <Grow in={ visible } timeout={ Math.floor( Math.random() * 500) + 500 }>
            <div className={ classes.root + ' Publication new' }>
                <ExpansionPanel key={ props.doi }>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <ListItemText className={ classes.heading }
                        primary={ props.title }
                        secondary={ props.doi }
                        classes={{
                            primary: classes.primary,
                            secondary: classes.secondary
                        }}
                    />
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography className={ classes.citation }>
                            { props.citation }
                        </Typography>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails>
                        <div className={ classes.column }>
                            <Typography className={ classes.date }>
                                { props.date }
                            </Typography>
                        </div>
                        <div className={ classes.column }>
                            <Typography className={ classes.link }>
                                <DOILink doi={ props.doi }/>
                            </Typography>
                        </div>
                    </ExpansionPanelDetails>
                    { props.children }
                </ExpansionPanel>
            </div>
        </Grow>
    )
}

export default withStyles(styles)(publication)
import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import DOILink from '../DOILink/DOILink'

const styles = (theme) => ({
    root: {
        marginBottom: theme.spacing.unit,
    },
    title: {
        color: '#222',
        textAlign: 'left',
        flex: '1',
        marginBottom: theme.spacing.unit,
    },
    doi: {
        color: '#999',
        marginBottom: theme.spacing.unit,
    },
    citation: {
        color: '#aaa',
        textAlign: 'left',
        marginBottom: theme.spacing.unit,
    },
    link: {
        textAlign: 'right',
    },
});

const publication = ( props ) => {
    const { classes, publication } = props;
    return (
        <Paper className={ classes.root } elevation={0}>
            <Typography className={ classes.title }>
                { publication.title }
            </Typography>
            <Typography className={ classes.doi }>
                <span className={ classes.doi }>{ publication.doi }</span>
            </Typography>
            <Typography className={ classes.citation }>
                { publication.citation }
            </Typography>
            <Typography className={ classes.link }>
                <DOILink doi={ publication.doi }/>
            </Typography>
        </Paper>
    )
}

export default withStyles(styles)(publication)
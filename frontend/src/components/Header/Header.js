import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
    appbar: {
        backgroundColor: '#333',
        color: theme.palette.common.white,
    },
    toolbar: {
        width: '90%',
        maxWidth: '720px',
        marginTop: 2 * theme.spacing.unit,
        marginBottom: 2 * theme.spacing.unit,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    title: {
        flexGrow: 1,
    },
});

const header = ( props ) => {
    const { classes } = props;
    return (
        <AppBar position="static" className={ classes.appbar }>
            <Toolbar className={ classes.toolbar }>
                <Typography variant="title" color="inherit" className={ classes.title }>
                    { props.title }
                </Typography>
                { props.children }
            </Toolbar>
        </AppBar>
    )
}

export default withStyles(styles)(header)

import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { IconButton, Tooltip } from '@material-ui/core'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'

const styles = (theme) => ({
    root: {},
    link: {
        color: '#00abc7',
        textDecoration: 'none',
        fontSize: 'small',
    },
    text: {
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
    },
    icon: {
        color: 'inherit',
        fontSize: 'medium',
        verticalAlign: 'middle',
    },
});

const doiLink = ( props ) => {
    const { classes } = props;
    return (
        <a href={ "https://doi.org/" + props.doi } target="_blank" rel="noreferrer noopener" className={ classes.link }>
        <Tooltip title="View Publication" placement="left">
            <IconButton color="primary">
                <InsertDriveFileIcon  className={ classes.icon }/>
            </IconButton>
        </Tooltip>
        </a>
    )
}

export default withStyles(styles)(doiLink)

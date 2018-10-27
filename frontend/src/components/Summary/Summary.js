import React from 'react'
import { withStyles } from '@material-ui/core/styles'

const styles = ( theme ) => ({
    root: {
        color: theme.palette.grey[500],
        display: 'flex',
        justifyContent: 'space-between',
    },
    filtered: {
        flex: 1,
        textAlign: 'left',
    },
    total: {
        flex: 1,
        textAlign: 'right',
    },
})

const summary = ( props ) => {
    const { classes } = props
    return (
        <div className={ classes.root } >
            <h4 className={ classes.filtered } >
                Showing { props.visibleCount } of { props.listedCount } filtered publications
            </h4>
            <h4 className={ classes.total } >
                { props.totalCount } Publications
            </h4>
        </div>
    )
}

export default withStyles(styles)(summary)
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'

const styles = ( theme ) => ({
    root: {
        float: 'right',
        marginLeft: '1rem',
    },
})

const showMore = ( props ) => {
    const { classes } = props
    return (
        <Button
            variant="outlined"
            color="primary"
            className={ classes.root }
            onClick={ props.showMore }
            disabled={ props.disabled }
        >
            Show { props.perPage || '' } More
        </Button>
    )
}

export default withStyles(styles)(showMore)
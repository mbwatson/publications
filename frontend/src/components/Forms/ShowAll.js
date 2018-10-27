import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'

const styles = ( theme ) => ({
    root: {
        float: 'right',
        marginLeft: '1rem',
    },
})

const showAll = ( props ) => {
    const { classes } = props
    return (
        <Button
            variant="outlined"
            color="primary"
            className={ classes.root }
            onClick={ props.showAll }
            disabled={ props.disabled }
        >
            Show All ({ props.count })
        </Button>
    )
}

export default withStyles(styles)(showAll)
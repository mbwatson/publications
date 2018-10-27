import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Typography, FormControl, Switch } from '@material-ui/core'

const styles = (theme) => ({
    root: {
        marginBottom: 4*theme.spacing.unit,
    },
    formControl: {},
})

const settingsForm = ( props ) => {
    const { classes } = props

    return (
        <form className={ classes.root } onSubmit={ props.submit }>
            <Switch
                checked={props.filterType}
                onChange={this.handleChange('filter')}
                value="filter"
            >
            </Switch>
        </form>
    )

}

export default withStyles(styles)(settingsForm)

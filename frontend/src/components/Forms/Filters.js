import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Grid, FormControl, InputLabel, TextField, IconButton, NativeSelect } from '@material-ui/core'
import { Backspace as BackspaceIcon } from '@material-ui/icons'
import _ from 'lodash'

const styles = (theme) => ({
    root: {
        marginBottom: 4*theme.spacing.unit,
    },
    queryInput: { },
    yearSelect: {
        width: '100%'
    },
    formControl: {
        display: 'flex'
    },
    resetButton: {
        position: 'absolute',
        right: -1 * theme.spacing.unit,
        top: -1 * theme.spacing.unit,
        margin: 0,
    },
})

const filters = ( props ) => {
    const { classes } = props
    return (
        <form className={ classes.root } id="publication-filter" onSubmit={ event => event.preventDefault() }>
            <Grid container spacing={32} alignItems="baseline" alignContent="stretch" justify="center">
                <Grid item xs={12} sm={8} md={9}>
                    <TextField fullWidth
                        id="query-input"
                        className={ classes.queryInput }
                        name="query"
                        label="Filter Publications"
                        margin="normal" 
                        onChange={ props.updateQueryStringInput }
                        value={ props.queryString }
                        InputProps={{
                            endAdornment: <IconButton type="reset"
                                            onClick={ props.clearQuery }
                                            className={ classes.resetButton }
                                        >
                                            <BackspaceIcon />
                                        </IconButton>,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                    <FormControl className={ classes.formControl }>
                        <InputLabel htmlFor="age-native-simple">Publication Year</InputLabel>
                        <NativeSelect
                            className={ classes.yearSelect }
                            onChange={ props.updateQueryYearSelect }
                            value={ props.queryYear || ''}
                            
                        >
                            <option value=""/>
                            {
                                _.range(2000, new Date().getFullYear() + 1).reverse()
                                    .map(year => <option key={year} value={year}>&nbsp;&nbsp;&nbsp;{year}</option>)
                            }
                    </NativeSelect>
                    </FormControl>
                </Grid>
            </Grid>
        </form>
    )

}

export default withStyles(styles)(filters)

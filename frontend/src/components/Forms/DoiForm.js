import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
    root: {
        marginBottom: 4*theme.spacing.unit,
    },
    doiInput: {
    },
    addButton: {
        flex: 1
    },
    formControl: {
        display: 'flex',
        margin: theme.spacing.unit,
    },
    errorMessage: {
        color: '#f66',
    },
});

const doiForm = ( props ) => {
    const { classes } = props

    return (
        <form className={ classes.doiForm } onSubmit={ props.stagePublicationEvent }>
            <FormControl className={ classes.formControl } error aria-describedby="name-error-text">
                <Typography>Enter the DOI of a publication below.</Typography>
                <TextField
                    fullWidth
                    error={ props.errorMessage !== '' }
                    id="addDoiInput"
                    className={ classes.doiInput }
                    label="Enter DOI"
                    margin="normal"
                    onFocus={ props.clearErrors }
                    InputProps={{
                        endAdornment: <IconButton type="reset" onClick={ props.clearErrors }><i className="material-icons">backspace</i></IconButton>,
                    }}
                />
                <FormHelperText className={ classes.errorMessage } id="name-error-text">{ props.errorMessage }</FormHelperText>
            </FormControl>
            <Button xs={12} sm={2} type="submit" fullWidth
                color="primary" variant="outlined"
                className={ classes.addButton }>
                Fetch Publication
            </Button>
        </form>
    )

}

export default withStyles(styles)(doiForm)

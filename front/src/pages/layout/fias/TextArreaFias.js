import React from 'react'
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux'
import { setFiasData } from '../../../actions/fiasActions'
import handleText from '../handleText'


function TextArreaFias(props) {
    function changeHandler(e) {
        props.setFiasData({ [e.target.name]: e.target.value })
    }
    return (
        <TextField
            style={{ width: "100%", marginTop: "1rem" }}
            name={props.name}
            value={props.fiasData[props.name]}
            onChange={changeHandler}
            label={handleText(props.label, props.language)}
            error={props.textArreaError.indexOf(props.error) >= 0}
            helperText={props.textArreaError.indexOf(props.error) >= 0 ? handleText(fiasError[props.error], props.language) : ""}
            variant="outlined"
        />
    )
}

const mapStateToProps = state => ({
    language: state.term.language,
    fiasData: state.term.fiasData,
    error: state.term.error,
})

export default connect(mapStateToProps, { setFiasData })(TextArreaFias)
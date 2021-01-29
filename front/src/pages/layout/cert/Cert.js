import React, { Component } from 'react'
import { connect } from 'react-redux'

import { setSert } from '../../../actions/TermActions'
import handleText from '../handleText'
import Terms from '../term/Terms'

import InputAdornment from '@material-ui/core/InputAdornment';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';


class Cert extends Component {
    constructor() {
        super()
        this.state = {
            passValue: "",
            showPass: false,
        }
    }
    handleChange(e) {
        if (e.target.value.length <= 30)
            this.props.setSert(e.target.value)
    }
    handleError() {
        if (this.props.error in certError)
            return handleText(certError[this.props.error], this.props.language)
        return ""
    }

    render() {
        return (
            <div>
                <FormControl style={{ "width": "100%" }}>

                    {/* Текст пароль внутри инсерт бокса */}
                    <InputLabel htmlFor="standard-adornment-password">
                        {handleText(certComponentText.certPasswordInputText, this.props.language)}
                    </InputLabel>

                    {/* Инсерт бокс для ввода пароля, для входа в интернет */}
                    <Input
                        id="standard-adornment-password"
                        type={this.state.showPass ? "text" : 'password'}
                        value={this.props.sert}
                        onChange={this.handleChange.bind(this)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => this.setState({ showPass: !this.state.showPass })}
                                >
                                    {this.state.showPass ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />

                    {/* Текст выводит ошибку, при неверных данных сертификата */}
                    <label style={{ "color": "red" }}>
                        {this.handleError.bind(this)()}
                    </label>
                </FormControl>

                {/* Дальнейший текст сообщает где взять пароль и как вводить данные */}
                <p>{handleText(certComponentText.howToObtainPassword, this.props.language)}</p>
                <p>{handleText(certComponentText.passwordExplanation, this.props.language)}</p>
                <Terms />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    language: state.term.language,
    error: state.term.error,
    sert: state.term.sert,
})

export default connect(mapStateToProps, { setSert })(Cert)
import React, { Component } from 'react'
import { connect } from 'react-redux'

import FormControlLabel from '@material-ui/core/FormControlLabel';
import DialogWindow from './DialogWindow'
import handleText from '../handleText'

import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';


const GreenCheckbox = withStyles({
    root: {
        color: "#0",
        '&$checked': {
            color: "#fcbf49",
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);


class Terms extends Component {
    constructor(props) {
        super(props)
        this.state = {
            openDialog: false,
            acceptance: false,
            value: "",
        }
    }
    render() {
        return (
            <div className="term">

                {/* Текст о необходимости принятия условий соглашения с ссылкой на модалюное окно */}
                <div className="text-center mt-4">
                    <p>{handleText(textInTerms.termTextNeedToAccess, this.props.language)}
                        <a onClick={() => this.setState({ openDialog: true })} className="link">
                            {handleText(textInTerms.termTextNeedToAccessLink, this.props.language)}
                        </a>
                    </p>
                </div>

                {/* Чекбокс принятия соглашения */}
                <div>
                    <input checked={this.state.acceptance} onChange={e => this.setState({ acceptance: !this.state.acceptance })} type="checkbox" id="cb1" />
                    <label htmlFor="cb1">{handleText(textInTerms.checkboxText, this.props.language)}</label>
                </div>

                {/* Форма с данными о сертификате и прочее */}
                <form method="POST" className="text-center">
                    {this.props.mode == "cert" ? <input type="hidden" name="certificate" value={this.props.sert}></input> : ""}
                    {this.props.mode == "fias" ? <input type="hidden" name="room_number" value={this.props.fiasData.roomNumber}></input> : ""}
                    {this.props.mode == "fias" ? <input type="hidden" name="surname" value={this.props.fiasData.surnameText}></input> : ""}
                    {this.props.mode == "fias" ? <input type="hidden" name="reservation" value={this.props.fiasData.reservationText}></input> : ""}
                    <input type="hidden" name="agreement" value={this.state.acceptance}></input>
                    <input type="hidden" name="lang" value={this.props.language}></input>
                    <input type="hidden" name="data" value={data.data}></input>
                    <button
                        className={this.state.acceptance ? "send enable" : "send disable"}
                        disabled={!this.state.acceptance}
                    >
                        <h3>{handleText(textInTerms.sendButtonText, this.props.language)}</h3>
                    </button>
                </form>

                {/* Модальное окно с содержанием условий соглашения */}
                <DialogWindow
                    setState={this.setState.bind(this)}
                    state={this.state}
                    language={this.props.language} />
            </div >
        )
    }
}

const mapStateToProps = state => ({
    language: state.term.language,
    fiasData: state.term.fiasData,
    sert: state.term.sert,
    mode: state.term.mode,
})

export default connect(mapStateToProps, null)(Terms)
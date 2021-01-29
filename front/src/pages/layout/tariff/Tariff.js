import React, { Component } from 'react'
import { connect } from 'react-redux'
import handleText from '../handleText'

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

class Tariff extends Component {
    constructor(props) {
        super(props)
        const tariffMatch = tariff && tariff.length > 0 ? tariff.match(/&#39;.*?&#39;|&#x27;.*?&#x27;/g) : []
        const tariffArray = tariffMatch ? tariffMatch.map(c => c.replaceAll(/&#39;|&#x27;/g, '')) : []
        this.state = {
            tariffes: tariffArray,
            selectedTariff: tariffArray.length > 0 ? tariffArray[0] : '',
        }
    }
    render() {
        return (
            <div>
                {/* <select
                    onChange={e => this.setState({ selectedTariff: e.target.value })}
                    value={this.state.selectedTariff}>
                    {this.state.tariffes.map((t, i) => <option key={i}>{t}</option>)}
                </select> */}

                <FormControl style={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-label">{handleText(tariffComponent.tariffLable, this.props.language)}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={this.state.selectedTariff}
                        onChange={e => this.setState({ selectedTariff: e.target.value })}
                    >
                        {this.state.tariffes.map((t, i) => <MenuItem value={t} key={i}>{t}</MenuItem>)}
                    </Select>
                </FormControl>

                <p>{handleText(tariffComponent.selectTariffText, this.props.language)}</p>

                <form method="POST" className="text-center">
                    <input type="hidden" name="tariff" value={this.state.selectedTariff}></input>
                    <input type="hidden" name="lang" value={this.props.language}></input>
                    <input type="hidden" name="data" value={data.data}></input>
                    <button className={"send enable"}>
                        <h3>{handleText(tariffComponent.sendButton, this.props.language)}</h3>
                    </button>
                </form>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    language: state.term.language,
})

export default connect(mapStateToProps, null)(Tariff)
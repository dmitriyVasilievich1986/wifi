import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import { Cert, Fias, Error, Free, Tariff } from './pages/layout'
import { Language, Greetings, Footer } from './pages'

function getIfCertError(propsError, inError = {}, notInError = {}) {
    if ((propsError == '' || propsError in inError) && !(propsError in notInError))
        return true
    return false
}

const MODE_ITEMS = [
    'free',
    'cert',
    'fias',
    'tariff',
]

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            error: store.getState().term.error,
            mode: store.getState().term.mode,
        }
    }
    render() {
        return (
            <Provider store={store}>
                <Language />
                <div className='main'>
                    <div className="form-logo" />
                    <Greetings />
                    {this.state.mode == "free" && getIfCertError(this.state.error, {}, { ...fiasError, ...certError }) ? <Free /> : ""}
                    {this.state.mode == "cert" && getIfCertError(this.state.error, certError, fiasError) ? <Cert /> : ""}
                    {this.state.mode == "fias" && getIfCertError(this.state.error, fiasError, certError) ? <Fias /> : ""}
                    {this.state.mode == "tariff" && getIfCertError(this.state.error, {}, { ...fiasError, ...certError }) ? <Tariff /> : ""}
                    {!getIfCertError(this.state.error, { ...fiasError, ...certError }) || !MODE_ITEMS.includes(this.state.mode) ? <Error /> : ""}
                </div>
                <Footer />
            </Provider>
        )
    }
}


ReactDOM.render(<App />, document.getElementById('app'))
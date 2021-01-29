import React, { Component } from 'react'
import { connect } from 'react-redux'

import errorComponentText from './errorComponentText'
import handleText from '../handleText'

class Error extends Component {
    constructor(props) {
        super(props)
        this.errorHandle = this.errorHandle.bind(this)
    }
    errorHandle() {
        if (this.props.error in errorDict)
            return handleText(errorDict[this.props.error], this.props.language)
        return handleText(errorComponentText.defaultErrorText, this.props.language)
    }
    render() {
        return (
            <div>
                <p>{this.errorHandle()}</p>
                {data.data.url ? <a className="error-link" href={data.data.url}>{handleText(errorComponentText.tryAgainLinkText, this.props.language)}</a> : ""}
            </div >
        )
    }
}

const mapStateToProps = state => ({
    language: state.term.language,
    error: state.term.error,
})

export default connect(mapStateToProps, null)(Error)
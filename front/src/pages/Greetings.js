import React from 'react'
import { connect } from 'react-redux'
import handleText from './layout/handleText'


function Greetings(props) {
    return (
        <h3 style={{ width: "100%" }}>{handleText(props.greetingText, props.language)}</h3>
    )
}

const mapStateToProps = state => ({
    greetingText: state.term.greetingText,
    language: state.term.language
})

export default connect(mapStateToProps, null)(Greetings)
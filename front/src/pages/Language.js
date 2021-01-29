import React from 'react'
import { connect } from 'react-redux'
import { changeLanguage } from '../actions/TermActions'

function Language(props) {
    return (
        <div className="header">
            <div className="container">
                <div className="logo" />
                <div>
                    <button
                        className={props.language == "ru" ? 'language enable' : 'language disable'}
                        onClick={() => props.changeLanguage("ru")}>Рус</button>
                    <button
                        className={props.language == "en" ? 'language enable' : 'language disable'}
                        onClick={() => props.changeLanguage("en")}>Eng</button>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    language: state.term.language,
})

export default connect(mapStateToProps, { changeLanguage })(Language)
import React from 'react'
import Terms from '../term/Terms'
import TextArreaFias from './TextArreaFias'
import textArreaArray from './textArreaArray'
import handleText from '../handleText'
import { connect } from 'react-redux'


function Fias(props) {
    return (
        <div>
            {textArreaArray.map((ta, i) => ta.visible ? <TextArreaFias {...ta} key={i} /> : "")}
            <p>{handleText(fiasComponentText.insertDataExplanation, props.language)}</p>
            <Terms />
        </div>
    )
}

const mapStateToProps = state => ({
    language: state.term.language,
})

export default connect(mapStateToProps, null)(Fias)
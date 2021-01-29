import React from 'react'
import TermTextEn from './TermTextEn'
import TermTextRu from './TermTextRu'
import handleText from '../handleText'

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

function handleModalWindow(lang) {
    if (lang == "ru")
        return <TermTextRu />
    else if (lang == "en")
        return <TermTextEn />
    return ""
}

function DialogWindow(props) {
    return (
        <Dialog
            open={props.state.openDialog}
            onClose={() => props.setState({ openDialog: false })}
            scroll="paper"
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >

            {/* Титульник модального окна */}
            <DialogTitle id="scroll-dialog-title" style={{ "backgroundColor": "#f8edeb" }}>
                {handleText(textInTerms.modalFormTitle, props.language)}
            </DialogTitle>

            {/* Содержание окна */}
            <DialogContent dividers={scroll === 'paper'}>
                {handleModalWindow(props.language)}
            </DialogContent>

            {/* Кнопка принятия соглашения */}
            <DialogActions style={{ "backgroundColor": "#f8edeb" }}>
                <button
                    className="accept-button"
                    onClick={() => props.setState({ openDialog: false, acceptance: true })}
                >{handleText(textInTerms.checkboxText, props.language)}</button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogWindow
import React from 'react'
import HeadsetMicIcon from '@material-ui/icons/HeadsetMic';

export default function Footer() {
    return (
        <div className="footer">
            <div className="container">
                <div>
                    <div className="row">
                        <p>Билайн {"\u00A9"} 2020</p>
                        <a className="footer-link" href="https://beeline.ru">beeline.ru</a>
                    </div>
                    <div className="row"><p>Услуга предоставляется ПАО "ВымпелКом"</p></div>
                    <div className="row">
                        <HeadsetMicIcon />
                        <a className="footer-link" href="78007002111">+7 (800) 700-21-11</a>
                        <a className="footer-link" href="fix@beeline.ru">fix@beeline.ru</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

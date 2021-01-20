import React from 'react';
import '../style/player.css';

export default function HiddenValidation() {
    return (
        <div id="hiddenContainer">
            <img id="contactLoader" alt="" src="../../../public/loader.gif" hidden />
            <div id="messageWarning" className="hiddenErrMsg" hidden>
                <i className="fa fa-exclamation-circle" />
                There was an error, please try again.
            </div>
            <div id="messageHoneypot" className="hiddenErrMsg" hidden>
                <i className="fa fa-exclamation-circle" />
                Spamming detected!
                <br />
            </div>
            <div id="messageIncomplete" className="hiddenErrMsg" hidden>
                <i className="fa fa-exclamation-circle" />
                Please fill in all required fields marked with an asterisk.
                <br />
            </div>
            <div id="messageInvalidEmail" className="hiddenErrMsg" hidden>
                <i className="fa fa-exclamation-circle" />
                Please provide a valid email address.
                <br />
            </div>
            <div id="messageSuccess" className="hiddenSucessMsg" hidden>
                <i className="fa fa-check" />
                Your message was sent, thank you!
                <br />
            </div>
        </div>
    );
}

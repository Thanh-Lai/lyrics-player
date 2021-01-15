import React, { Component } from 'react';
import '../style/contact.css';
import linkedIn from '../../../public/linkedin.png';
import web from '../../../public/web.png';

export default class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            subject: '',
            email: '',
            message: '',
            honeypot: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log('submit', this.state);
    }

    render() {
        return (
            <div id="contactContainer">
                <form id="contactForm" onSubmit={e => this.handleSubmit(e)}>
                    <strong>Message me</strong>
                    <br />
                    <br />
                    <input
                        autoComplete="off"
                        type="text"
                        className="contactInput"
                        id="name"
                        name="name"
                        placeholder="*Name"
                        onKeyUp={e => this.handleChange(e)}
                    />
                    <br />
                    <input
                        autoComplete="off"
                        type="text"
                        className="contactInput"
                        id="subject"
                        name="subject"
                        placeholder="Subject"
                        onKeyUp={e => this.handleChange(e)}
                    />
                    <br />
                    <input
                        autoComplete="off"
                        type="text"
                        className="contactInput"
                        id="email"
                        name="email"
                        placeholder="Email address"
                        onKeyUp={e => this.handleChange(e)}
                    />
                    <br />
                    <textarea
                        autoComplete="off"
                        className="contactInput"
                        id="message"
                        name="message"
                        placeholder="*Contact me or report any issues"
                        onKeyUp={e => this.handleChange(e)}
                    />
                    <br />
                    <input id="contactBtn" type="submit" value="Submit" />
                    <div id="hiddenContainer">
                        <img id="contactLoader" alt="" src="../../../public/loader.gif" hidden />
                        <div id="messageWarning" hidden> There was an error, please try again.</div>
                        <div id="messageHoneypot" hidden>
                            <i className="fa fa-check" />
                            Spamming detected.
                            <br />
                        </div>
                        <div id="messageIncomplete" hidden>
                            <i className="fa fa-check" />
                            Please fill in all required fields marked with an asterisk.
                            <br />
                        </div>
                        <div id="messageInvalidEmail" hidden>
                            <i className="fa fa-check" />
                            Please provide a valid email address.
                            <br />
                        </div>
                    </div>
                    <div>
                        <input
                            autoComplete="off"
                            defaultValue=""
                            type="text"
                            id="honeypot"
                            name="honeypot"
                            hidden
                            onKeyUp={e => this.handleChange(e)}
                        />
                    </div>

                </form>
                <hr id="horizontal" />
                <div style={{ marginTop: '20px' }}>
                    <div id="contactLinks">
                        <div className="contactInfo">
                            <img className="contactImg" alt="linkedin" src={linkedIn} />
                            &nbsp;
                            <a href="https://www.linkedin.com/in/thanhlai/" rel="noreferrer" target="_blank">LinkedIn</a>
                        </div>
                        <div className="contactInfo">
                            <img className="contactImg" alt="web" src={web} />
                            &nbsp;
                            <a href="https://www.thanh-lai.com/#home" rel="noreferrer" target="_blank">Website</a>
                        </div>
                    </div>
                    <form action="https://www.paypal.com/donate" method="post" target="_blank">
                        <input type="hidden" name="business" value="HU5A7M5FMKRHC" />
                        <input type="hidden" name="currency_code" value="USD" />
                        <input
                            type="image"
                            src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"
                            border="0"
                            name="submit"
                            title="PayPal - The safer, easier way to pay online!"
                            alt="Donate with PayPal button"
                        />
                        <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
                    </form>
                </div>
            </div>
        );
    }
}

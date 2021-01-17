import React, { Component } from 'react';
import $ from 'jquery';
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
        this.resetForm();
        this.toggleDisableForm(true);
        const {
            name, subject, email, message
        } = this.state;
        const location = 'Lyrics Player';
        const emailData = 'location=' + location + '&contactName=' + name + '&contactEmail=' + email
        + '&contactSubject=' + subject + '&contactMessage=' + message;
        if (this.validateForm()) {
            return;
        }
        $.ajax({
            type: 'POST',
            url: 'https://script.google.com/macros/s/AKfycbwmoKJwas9QQVOIg27eF5Ufy-HjQsH9P1J1bIjFak8E7nN9x2k/exec',
            data: emailData,
            success: $.proxy((response) => {
                if (response.result === 'success') {
                    document.getElementById('contactForm').reset();
                    this.toggleDisableForm(true);
                    this.toggleMessage('#messageSuccess', true);
                } else {
                    this.toggleMessage('#messageWarning', true);
                }
            }, this),
            error: $.proxy(() => {
                this.toggleMessage('#messageWarning', true);
            }, this),
        });
    }

    validateForm() {
        const {
            name, email, message, honeypot
        } = this.state;
        if (honeypot.length > 0) {
            this.toggleMessage('#messageHoneypot', true);
            return true;
        }
        if (!name.length) {
            this.toggleDisableForm(false);
            this.toggleMessage('#messageIncomplete', true);
            $('#name').css('border-color', 'red');
            return true;
        }
        if (!message.length) {
            this.toggleDisableForm(false);
            this.toggleMessage('#messageIncomplete', true);
            $('#message').css('border-color', 'red');
            return true;
        }
        if (email.length && !this.validateEmail(email)) {
            this.toggleDisableForm(false);
            $('#email').css('border-color', 'red');
            this.toggleMessage('#messageInvalidEmail', true);
            return true;
        }
        return false;
    }

    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    resetForm() {
        const inputs = ['#name', '#email', '#message', '#subject'];
        const errMsgs = ['#messageWarning', '#messageHoneypot', '#messageIncomplete', '#messageInvalidEmail'];
        this.toggleDisableForm(false);
        inputs.forEach((input) => {
            $(input).css('border-color', 'black');
        });
        errMsgs.forEach((msg) => {
            this.toggleMessage(msg, false);
        });
    }

    toggleMessage(message, show) {
        if (show) {
            $(message).fadeIn();
        } else {
            $(message).fadeOut();
        }
    }

    toggleDisableForm(disable) {
        document.getElementById('contactBtn').disabled = disable;
        const inputs = document.getElementsByClassName('contactInput');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].disabled = disable;
        }
    }

    render() {
        return (
            <div id="contactContainer">
                <form id="contactForm" onSubmit={e => this.handleSubmit(e)}>
                    <strong>Send a Message</strong>
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

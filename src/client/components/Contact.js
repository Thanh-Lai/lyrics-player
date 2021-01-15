import React from 'react';
import '../style/contact.css';
import linkedIn from '../../../public/linkedin.png';
import web from '../../../public/web.png';

export default function Contact() {
    return (
        <div id="contactContainer">
            <form id="contactForm">
                <strong>Message me</strong>
                <br />
                <br />
                <input type="text" className="contactInput" id="name" name="name" placeholder="*Name" />
                <br />
                <input type="text" className="contactInput" id="subject" name="subject" placeholder="Subject" />
                <br />
                <input type="text" className="contactInput" id="email" name="email" placeholder="Email address" />
                <br />
                <textarea className="contactInput" id="message" name="message" placeholder="*Contact me or report any issues" style={{ height: '200px' }} />
                <br />
                <input id="contactBtn" type="submit" value="Submit" />
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
                    <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
                    <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
                </form>
            </div>
        </div>
    );
}

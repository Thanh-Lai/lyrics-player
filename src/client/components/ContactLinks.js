import React from 'react';
import '../style/contact.css';
import linkedIn from '../../../public/linkedin.png';
import web from '../../../public/web.png';

export default function ContactLinks() {
    return (
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
    );
}

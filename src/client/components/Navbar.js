import React from 'react';
// import { Link } from 'react-router-dom';


export default function Navbar() {
    return (
        <header>
            <nav>
                <ul id="navigation">
                    <li><a href="/">Home</a></li>
                    <li><a href="/contact">Contact</a></li>
                    <li style={{ color: 'white' }}>&nbsp;|&nbsp;</li>
                    <li><a href="/login">Log In</a></li>
                </ul>
            </nav>
        </header>
    );
}

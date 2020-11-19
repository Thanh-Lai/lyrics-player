import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <header>
            <nav>
                <ul id="navigation">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    <li style={{ color: 'white' }}>&nbsp;|&nbsp;</li>
                    <li><a href="/login">Log In</a></li>
                </ul>
            </nav>
        </header>
    );
}

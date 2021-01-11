import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_KEY } from '../../../secrets';
import LoggingButton from './LoggingButton';

export default class Navbar extends Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogin() {
        axios.get('http://localhost:8888/auth/login', {
            headers: {
                Authorization: API_KEY
            }
        }).then((res) => {
            window.location.href = res.data;
        }).catch((err) => {
            console.log(err);
        });
    }

    handleLogout() {
        axios.get('http://localhost:8888/auth/logout', {
            headers: {
                Authorization: API_KEY
            }
        }).then((res) => {
            window.location.href = res.data;
        }).catch((err) => {
            console.log(err);
        });
    }

    render() {
        const handleClick = { in: this.handleLogin, out: this.handleLogout };
        return (
            <header>
                <nav>
                    <ul id="navigation">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        <li style={{ color: 'white' }}>&nbsp;|&nbsp;</li>
                        <LoggingButton handleClick={handleClick} />
                    </ul>
                </nav>
            </header>
        );
    }
}

import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_KEY } from '../../../secrets';

export default class Navbar extends Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
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

    render() {
        return (
            <header>
                <nav>
                    <ul id="navigation">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        <li style={{ color: 'white' }}>&nbsp;|&nbsp;</li>
                        <li><button type="button" id="loginBtn" onClick={this.handleLogin}>Log In</button></li>
                    </ul>
                </nav>
            </header>
        );
    }
}

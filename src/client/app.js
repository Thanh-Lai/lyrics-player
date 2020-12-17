import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';
import { API_KEY } from '../../secrets';
import {
    Home, Contact, Navbar
} from './components';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: {},
            init: false
        };
    }

    componentDidMount() {
        axios.get('http://localhost:8888/auth/loginStatus', {
            headers: {
                Authorization: API_KEY
            }
        }).then((result) => {
            this.setState({
                login: result.data,
                init: true
            });
        });
    }

    render() {
        if (!this.state.init) return (null);
        return (
            <main>
                <Navbar loginInfo={this.state.login} />
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/contact" component={Contact} />
                    <Route component={Home} />
                </Switch>
            </main>
        );
    }
}

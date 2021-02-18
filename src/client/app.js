import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';
import platform from 'platform';
import { API_KEY, ENV } from '../../secrets';
import Home from './components/Home';
import Contact from './components/Contact';
import Navbar from './components/Navbar';

export default class App extends Component {
    componentDidMount() {
        const key = `Spotify_${platform.name}`;
        if (localStorage.getItem(key) && localStorage.getItem(key)['tokenInfo']) return;
        axios.get(ENV + '/auth/accessToken', {
            headers: {
                Authorization: API_KEY
            }
        }).then((data) => {
            let tokenData = { token: data.data };
            if (data.data !== 'No Token') {
                tokenData = {
                    token: data.data.access_token,
                    timestamp: data.data.timestamp
                };
            }
            const storeInfo = {
                tokenInfo: tokenData
            };
            if (data.data.access_token) {
                axios.get(ENV + '/auth/loginStatus', {
                    headers: {
                        Authorization: API_KEY
                    },
                    params: {
                        token: data.data.access_token
                    }
                }).then((result) => {
                    storeInfo['profileInfo'] = result.data;
                    localStorage.setItem(key, JSON.stringify(storeInfo));
                    location.reload();
                }).catch((err) => {
                    console.log(err);
                });
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    render() {
        return (
            <main>
                <Navbar />
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/contact" component={Contact} />
                    <Route component={Home} />
                </Switch>
            </main>
        );
    }
}

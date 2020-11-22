import React, { Component } from 'react';
import axios from 'axios';
import { trackPromise } from 'react-promise-tracker';
import { SearchBox, AllSongs } from './index';
import '../app.css';
import { API_KEY } from '../../../secrets';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            matchedResults: {},
            clicked: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(event) {
        const songOrLyric = document.getElementById('textType').value;
        event.preventDefault();
        const { value } = event.target.inputValue;
        if (!value) return;
        const uriEncodeInput = encodeURI(value);
        const result = await trackPromise(axios.get(`http://localhost:8888/textSearch?query=${uriEncodeInput}&type=${songOrLyric}`, {
            headers: {
                Authorization: API_KEY,
            }
        }));
        this.setState({
            matchedResults: result.data,
            clicked: true
        });
    }

    render() {
        return (
            <div>
                <SearchBox onSubmit={this.handleSubmit} />
                <AllSongs clicked={this.state.clicked} matchedResults={this.state.matchedResults} />
            </div>
        );
    }
}
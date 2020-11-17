import React, { Component } from 'react';
import axios from 'axios';
import { SearchBox } from './components';
import './app.css';
import { API_KEY } from '../../secrets';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            matchedResults: {}
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(event) {
        const songOrLyric = 'lyrics'; // temp variable
        event.preventDefault();
        const { value } = event.target.inputValue;
        if (!value) return;
        const uriEncodeInput = encodeURI(value);
        const result = await axios.get(`http://localhost:23450/textSearch?query=${uriEncodeInput}&type=${songOrLyric}`, {
            headers: {
                Authorization: API_KEY,
            }
        });
        this.setState({ matchedResults: result.data });
    }

    render() {
        console.log('render', this.state.matchedResults);
        return (
            <div>
                <SearchBox onSubmit={this.handleSubmit} />
            </div>
        );
    }
}

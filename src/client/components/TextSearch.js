import React, { Component } from 'react';
import '../style/searchBox.css';

export default class TextSearch extends Component {
    constructor(props) {
        super(props);
        this.state = { value: 'lyrics' };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    render() {
        return (
            <form id="textSearchForm" onSubmit={event => this.props.onSubmit(event).option}>
                <select value={this.state.value} onChange={this.handleChange} name="textType" id="textType">
                    <option value="lyric">Lyrics</option>
                    <option value="song">Song Title</option>
                </select>
                <input placeholder="Search by lyrics or song title..." id="inputValue" type="textbox" />
                <button id="searchBtn" type="submit"><i className="fa fa-search" /></button>
            </form>
        );
    }
}

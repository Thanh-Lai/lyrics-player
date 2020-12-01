import React, { Component } from 'react';
import axios from 'axios';
import { trackPromise } from 'react-promise-tracker';
import { connect } from 'react-redux';
import { SearchBox, AllSongs } from './index';
import { updatePlayers } from '../store';
import '../app.css';
import { API_KEY } from '../../../secrets';

class Home extends Component {
    isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            matchedResults: {},
            token: '',
            clicked: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.isMounted = true;
        axios.get('http://localhost:8888/auth/accessToken', {
            headers: {
                Authorization: API_KEY
            }
        })
            .then((data) => {
                if (this.isMounted) {
                    this.setState({
                        token: data.data
                    });
                }
            });
    }

    componentWillUnmount() {
        this.isMounted = false;
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
        if (this.isMounted) {
            this.setState({
                matchedResults: result.data,
                clicked: true
            });
            const playList = {};
            Object.values(result.data).forEach((elem) => {
                if (elem.id && elem.spotifyUri) {
                    playList[elem.spotifyUri] = {};
                    playList[elem.spotifyUri]['playing'] = false;
                }
            });
            this.props.updatePlayersOnFetch(playList);
        }
    }

    render() {
        return (
            <div>
                <SearchBox onSubmit={this.handleSubmit} />
                <AllSongs token={this.state.token} clicked={this.state.clicked} matchedResults={this.state.matchedResults} />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updatePlayersOnFetch: (players) => {
            dispatch(updatePlayers(players));
        }
    };
};

export default connect(null, mapDispatchToProps)(Home);

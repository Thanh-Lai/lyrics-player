import React, { Component } from 'react';
import axios from 'axios';
import { trackPromise } from 'react-promise-tracker';
import { connect } from 'react-redux';
import platform from 'platform';
import SearchBox from './SearchBox';
import AllSongs from './AllSongs';
import { updatePlayers } from '../store';
import '../app.css';
import { API_KEY, ENV } from '../../../secrets';

class Home extends Component {
    isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            matchedResults: {},
            clicked: false,
        };
        this.refreshTimer = null;
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.isMounted = true;
        this.refreshTimer = setInterval(() => this.checkRefreshTimer(), 1000);
    }

    componentWillUnmount() {
        this.isMounted = false;
        clearInterval(this.refreshTimer);
    }

    checkRefreshTimer() {
        const key = `Spotify_${platform.name}`;
        const tokenInfo = (JSON.parse(localStorage.getItem(key)) && JSON.parse(localStorage.getItem(key)).tokenInfo)
            ? JSON.parse(localStorage.getItem(key)).tokenInfo : '';
        const timePast = Math.floor((Date.now() - tokenInfo.timestamp) / 1000);
        const expireTime = 3599;
        if (tokenInfo.timestamp && timePast >= expireTime) {
            axios.get(ENV + '/auth/logout', {
                headers: {
                    Authorization: API_KEY
                }
            }).then((res) => {
                localStorage.removeItem(`Spotify_${platform.name}`);
                window.location.href = res.data;
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    async handleSubmit(event) {
        const songOrLyric = document.getElementById('textType').value;
        event.preventDefault();
        const { value } = event.target.inputValue;
        if (!value) return;
        const uriEncodeInput = encodeURI(value);
        const result = await trackPromise(axios.get(`${ENV}/textSearch?query=${uriEncodeInput}&type=${songOrLyric}`, {
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
                    playList[elem.spotifyUri]['ready'] = false;
                    playList[elem.spotifyUri]['duration'] = elem.duration;
                }
            });
            this.props.updatePlayersOnFetch(playList);
        }
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

const mapStateToProps = (state) => {
    return {
        tokenInfo: state.token
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updatePlayersOnFetch: (players) => {
            dispatch(updatePlayers(players));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

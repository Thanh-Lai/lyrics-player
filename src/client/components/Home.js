import React, { Component } from 'react';
import axios from 'axios';
import { trackPromise } from 'react-promise-tracker';
import { connect } from 'react-redux';
import platform from 'platform';
import SearchBox from './SearchBox';
import AllSongs from './AllSongs';
import { updatePlayers, updateSpotifyPlayer } from '../store';
import '../app.css';
import { API_KEY, ENV } from '../../../secrets';

class Home extends Component {
    isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            matchedResults: {},
            clicked: false,
            deviceID: '',
            tokenInfo: '',
        };
        this.refreshTimer = null;
        this.playerCheckInterval = null;
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const key = `Spotify_${platform.name}`;
        const storage = JSON.parse(localStorage.getItem(key))
            ? JSON.parse(localStorage.getItem(key)) : {};
        this.isMounted = true;
        const tokenInfo = storage.tokenInfo ? storage.tokenInfo : '';
        this.setState({
            tokenInfo,
        });
        this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
        this.refreshTimer = setInterval(() => this.checkRefreshTimer(), 1000);
    }

    componentWillUnmount() {
        this.isMounted = false;
        clearInterval(this.refreshTimer);
        clearInterval(this.playerCheckInterval);
    }

    checkForPlayer() {
        const { tokenInfo } = this.state;
        const token = tokenInfo.token;
        this.updateIframeCSS();
        if (token && window.Spotify) {
            clearInterval(this.playerCheckInterval);
            this.player = new window.Spotify.Player({
                name: 'Spotify Lyrics Player',
                getOAuthToken: (cb) => { cb(token); },
                volume: 0.5
            });
            this.createEventHandlers();
            this.player.connect();
            this.props.setSpotifyPlayer(this.player);
        }
    }

    createEventHandlers() {
        this.player.on('initialization_error', (e) => { console.error(e); });
        this.player.on('authentication_error', (e) => { console.error(e); });
        this.player.on('account_error', (e) => { console.error(e); });
        this.player.on('playback_error', (e) => { console.error(e); });
        this.player.on('ready', ({ device_id }) => {
            console.log('Device Spotify Lyrics Player is ready');
            this.setState({ deviceID: device_id });
        });
    }

    updateIframeCSS() {
        const iframe = document.querySelector('iframe[src="https://sdk.scdn.co/embedded/index.html"]');
        if (iframe) {
            iframe.removeAttribute('style');
            iframe.style.display = 'block';
            iframe.style.position = 'absolute';
            iframe.style.top = '-1000px';
            iframe.style.left = '-1000px';
        }
    }

    checkRefreshTimer() {
        const { tokenInfo } = this.state;
        if (!tokenInfo) return;
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
                <AllSongs deviceID={this.state.deviceID} clicked={this.state.clicked} matchedResults={this.state.matchedResults} />
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
        },
        setSpotifyPlayer: (players) => {
            dispatch(updateSpotifyPlayer(players));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

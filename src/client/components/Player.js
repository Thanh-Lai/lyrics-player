import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updatePlayers } from '../store';

class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "",
            deviceId: "",
            loggedIn: false,
            position: 0,
            duration: 0,
        };
        this.playerCheckInterval = null;
    }

    componentDidMount() {
        // If every sec if player is ready
        this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
    }

    componentWillUnmount() {
        this.props.updatePlayer({});
    }

    onPlayClick() {
        const uri = this.props.uri;
        if (this.props.players[uri]['playing']) {
            this.player.togglePlay();
        } else {
            this.play({
                playerInstance: this.player,
                spotify_uri: uri
            });
        }
    }

    onStateChanged(state) {
        // if we're no longer listening to music, we'll get a null state.
        if (state !== null) {
            const {
                position,
                duration,
                current_track
            } = state.track_window;
            const currPlayList = { ...this.props.players };
            const uri = current_track.uri;
            const playList = {};
            Object.keys(currPlayList).forEach((elem) => {
                playList[elem] = {};
                playList[elem]['playing'] = (elem === uri) ? !state.paused : false;
            });
            if (uri) {
                this.props.updatePlayer(playList);
                this.setState({
                    position,
                    duration
                });
            }
        }
    }

    play({
        spotify_uri,
        playerInstance: {
            _options: {
                getOAuthToken,
                id
            }
        }
    }) {
        getOAuthToken((access_token) => {
            if (!spotify_uri) return;
            fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
                method: 'PUT',
                body: JSON.stringify({ uris: [spotify_uri] }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`
                },
            });
        });
    }


    checkForPlayer() {
        const { token, updatePlayer } = this.props;
        if (window.Spotify) {
            clearInterval(this.playerCheckInterval);
            this.player = new window.Spotify.Player({
                name: 'Spotify Lyrics Player',
                getOAuthToken: (cb) => { cb(token); }
            });
            const currPlayList = { ...this.props.players };
            this.createEventHandlers();
            updatePlayer(currPlayList);
            this.player.connect();
        }
    }

    createEventHandlers() {
        this.player.on('initialization_error', (e) => { console.error(e); });
        this.player.on('authentication_error', (e) => {
            console.error(e);
            this.setState({ loggedIn: false });
        });
        this.player.on('account_error', (e) => { console.error(e); });
        this.player.on('playback_error', (e) => { console.error(e); });

        // Playback status updates
        this.player.on('player_state_changed', (state) => { this.onStateChanged(state); });

        // Ready
        this.player.on('ready', (data) => {
            const { device_id } = data;
            console.log(`Device ${device_id}`);
            this.setState({ deviceId: device_id });
        });
    }

    render() {
        const uri = this.props.uri;
        const status = this.props.players[uri]['playing'] ? 'fa fa-pause-circle-o pause-btn' : 'fa fa-play-circle-o play-btn';
        return (
            <div className="song-player-container">
                <div className="songControls">
                    <div className="play-btn">
                        <i onClick={() => this.onPlayClick()} className={'fa play-btn' + status} aria-hidden="true" />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        players: state.players
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updatePlayer: (players) => {
            dispatch(updatePlayers(players));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Player);

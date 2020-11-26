import React, { Component } from 'react';

export default class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasTrack: true,
            token: "",
            deviceId: "",
            loggedIn: false,
            playing: false,
            position: 0,
            duration: 0,
        };
        this.playerCheckInterval = null;
    }

    componentDidMount() {
        console.log('spot', window.Spotify);
        this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
    }

    onPlayClick() {
        console.log('playing ', this.state.playing);
        if (!this.state.playing) {
            this.play({
                playerInstance: this.player,
                spotify_uri: this.props.songInfo.spotifyUri
            });
        } else {
            this.player.togglePlay();
        }
    }

    onStateChanged(state) {
        // if we're no longer listening to music, we'll get a null state.
        if (state !== null) {
            const {
                position,
                duration,
            } = state.track_window;
            const playing = !state.paused;
            this.setState({
                position,
                duration,
                playing
            });
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
        const { token } = this.props;
        if (window.Spotify !== null) {
            clearInterval(this.playerCheckInterval);
            this.player = new window.Spotify.Player({
                name: 'Spotify Lyrics Player',
                getOAuthToken: (cb) => { cb(token); }
            });
            this.createEventHandlers();
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
            console.log(this.props, 'handler')
            this.setState({ deviceId: device_id });
        });
    }

    render() {
        const status = this.state.playing ? 'fa fa-pause-circle-o pause-btn' : 'fa fa-play-circle-o play-btn';
        return (
            <div className="song-player-container">
                {!this.state.hasTrack ? <div>No Track Found</div>
                    : (
                        <div className="songControls">
                            <div className="play-btn">
                                <i onClick={() => this.onPlayClick()} className={'fa play-btn' + status} aria-hidden="true" />
                            </div>
                        </div>
                    )
                }
            </div>
        );
    }
}

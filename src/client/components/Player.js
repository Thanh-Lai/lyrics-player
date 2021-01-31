import React, { Component } from 'react';
import { connect } from 'react-redux';
import Playlist from './Playlist';
import PlayTracker from './PlayTracker';
import { updatePlayers, updatePlaylists } from '../store';
import '../style/player.css';

class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: 0,
            volume: 50,
            showPlaylist: false,
            currPlaylists: [],
            hasError: false
        };
        this.playerCheckInterval = null;
        this.handleSeekBar = this.handleSeekBar.bind(this);
        this.handleOpenPlaylist = this.handleOpenPlaylist.bind(this);
        this.handleClosePlaylist = this.handleClosePlaylist.bind(this);
        this.handleEnterPlaylist = this.handleEnterPlaylist.bind(this);
        this.handleLeavePlaylist = this.handleLeavePlaylist.bind(this);
    }

    componentDidMount() {
        this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
        this.getPlaylists();
    }

    componentWillUnmount() {
        const uri = this.props.uri;
        const player = this.props.players[uri];
        if (this.player) {
            this.pause({
                playerInstance: this.player,
            });
            this.movePlayer();
        }
        if (player) {
            clearInterval(player['playTimerInterval']);
        }
    }

    onPlayClick(position) {
        if (this.state.hasError) return;
        const uri = this.props.uri;
        const player = this.props.players[uri];
        if (!player['playing']) {
            this.play({
                playerInstance: this.player,
                spotify_uri: uri,
                position
            });
            clearInterval(player['playTimerInterval']);
            player['playTimerInterval'] = setInterval(() => {
                this.playTimer(this.state.position, uri);
            }, 1000);
            this.updateVolume(this.state.volume, `volume-${uri}`);
        } else {
            this.pause({
                playerInstance: this.player,
            });
        }
    }

    onStateChanged(state) {
        if (state !== null) {
            const {
                paused,
                position,
                track_window
            } = state;
            const currPlayList = { ...this.props.players };
            const uri = track_window.current_track.uri;
            const playList = {};
            Object.keys(currPlayList).forEach((elem) => {
                if (elem !== uri || paused) {
                    clearInterval(currPlayList[elem]['playTimerInterval']);
                }
                playList[elem] = {};
                playList[elem]['playing'] = (elem === uri) ? !paused : false;
                playList[elem]['duration'] = currPlayList[elem]['duration'];
                playList[elem]['playTimerInterval'] = (elem === uri) ? currPlayList[elem]['playTimerInterval'] : null;
                playList[elem]['position'] = (elem === uri) ? position : currPlayList[elem]['position'];
                playList[elem]['ready'] = true;
            });
            this.props.updatePlayer(playList);
        }
    }

    setVolume({
        volume,
        playerInstance: {
            _options: {
                getOAuthToken,
                id
            }
        }
    }) {
        getOAuthToken((access_token) => {
            fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}&device_id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`
                },
            });
        });
    }

    play({
        spotify_uri,
        position,
        playerInstance: {
            _options: {
                getOAuthToken,
                id
            }
        }
    }) {
        getOAuthToken((access_token) => {
            fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
                method: 'PUT',
                body: JSON.stringify(
                    {
                        uris: [spotify_uri],
                        position_ms: position
                    }
                ),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`
                },
            });
        });
    }

    pause({
        playerInstance: {
            _options: {
                getOAuthToken,
                id
            }
        }
    }) {
        getOAuthToken((access_token) => {
            fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`
                },
            });
        });
    }

    movePlayer() {
        fetch('', {
            method: 'PUT'
        });
    }

    updateVolume(volume, id) {
        this.moveSlider(id, volume, '#212121');
        this.setState({ volume: Number(volume) });
        this.setVolume({
            volume,
            playerInstance: this.player,
            currPlayList: []
        });
    }

    playTimer(currPosition, uri) {
        const player = this.props.players[uri];
        if (currPosition >= (Math.floor(player['duration'] / 1000) * 1000) - 2000) {
            clearInterval(player['playTimerInterval']);
            this.moveSlider(`seeker-${uri}Block`, 500, '#C5C5C5');
            this.moveSlider(`seeker-${uri}Inline`, 500, '#C5C5C5');
            this.setState({ position: 0 });
            return;
        }
        const position = currPosition + 1000;
        this.setState({ position });
        this.moveSlider(`seeker-${uri}Block`, currPosition, '#C5C5C5');
        this.moveSlider(`seeker-${uri}Inline`, currPosition, '#C5C5C5');
    }

    handleSeekBar(event, id) {
        if (this.state.hasError) return;
        const roundDown = (Math.floor(event.target.value / 1000) * 1000) - 5000;
        const value = roundDown < 0 ? 0 : Math.floor(roundDown);
        const uri = this.props.uri;
        const player = this.props.players;
        const isPlaying = player[uri] && player[uri]['playing'];
        if (isPlaying) {
            this.play({
                spotify_uri: uri,
                position: value,
                playerInstance: this.player
            });
            this.moveSlider(id, value, '#C5C5C5');
        } else {
            this.onPlayClick(value);
        }
        this.setState({ position: Number(value) });
    }

    moveSlider(id, newVal, color) {
        if (!newVal) return;
        const input = document.getElementById(id);
        input.value = newVal;
        const val = (input.value - input.getAttribute('min')) / (input.getAttribute('max') - input.getAttribute('min'));
        input.style.backgroundImage = '-webkit-gradient(linear, left top, right top, '
            + 'color-stop(' + val + ', #1DB954), '
            + 'color-stop(' + val + ', ' + color + ')'
            + ')';
    }

    millisToMinsAndSecs(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
    }

    handleOpenPlaylist(id, location = null) {
        if (!location) {
            this.getPlaylists();
        }
        document.getElementById(id).style.display = 'block';
    }

    handleClosePlaylist(id) {
        setTimeout(() => {
            if (!this.state.showPlaylist) {
                document.getElementById(id).style.display = 'none';
            }
        }, 1000);
    }

    handleEnterPlaylist(id) {
        this.setState({ showPlaylist: true });
        this.handleOpenPlaylist(id, 'container');
    }

    handleLeavePlaylist(id) {
        this.setState({ showPlaylist: false });
        this.handleClosePlaylist(id, 'container');
    }

    getPlaylists() {
        const { tokenInfo } = this.props;
        const token = tokenInfo.token;
        fetch(`https://api.spotify.com/v1/users/${this.props.profile.id}/playlists`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            return res.json();
        }).then((data) => {
            const allPlaylists = Array.isArray(data.items) ? data.items : [];
            const userPlaylists = [];
            allPlaylists.forEach((playlist) => {
                if (playlist.owner.id === this.props.profile.id) {
                    userPlaylists.push(playlist);
                }
            });
            this.props.updatePlaylists(userPlaylists);
            this.setState({ currPlaylists: userPlaylists });
        }).catch((err) => {
            console.log(err);
        });
    }

    checkForPlayer() {
        const { tokenInfo } = this.props;
        const token = tokenInfo.token;
        const playList = this.playlistInformation();
        this.updateIframeCSS();
        if (window.Spotify) {
            clearInterval(this.playerCheckInterval);
            this.player = new window.Spotify.Player({
                name: 'Spotify Lyrics Player',
                getOAuthToken: (cb) => { cb(token); },
                volume: 0.5
            });
            this.createEventHandlers();
            this.player.connect().then(() => {
                setTimeout(() => {
                    this.props.updatePlayer(playList);
                }, 1000);
            });
        }
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

    playlistInformation() {
        const currPlayList = { ...this.props.players };
        const playList = {};
        Object.keys(currPlayList).forEach((elem) => {
            playList[elem] = {};
            playList[elem]['playing'] = false;
            playList[elem]['duration'] = currPlayList[elem]['duration'];
            playList[elem]['playTimerInterval'] = null;
            playList[elem]['position'] = 0;
            playList[elem]['ready'] = true;
        });
        return playList;
    }

    createEventHandlers() {
        this.player.on('initialization_error', (e) => {
            this.setState({ hasError: true });
            console.error(e);
        });
        this.player.on('authentication_error', (e) => {
            this.setState({ hasError: true });
            console.error(e);
        });
        this.player.on('account_error', (e) => {
            this.setState({ hasError: true });
            console.error(e);
        });
        this.player.on('playback_error', (e) => {
            this.setState({ hasError: true });
            console.error(e);
        });
        this.player.on('player_state_changed', (state) => { this.onStateChanged(state); });
        this.player.on('ready', () => { console.log('Device Spotify Lyrics Player is ready'); });
    }

    render() {
        if (!Object.keys(this.props.players).length) return null;
        const players = this.props.players;
        const uri = this.props.uri;
        const duration = players[uri] ? players[uri]['duration'] : 0;
        const seekerID = `seeker-${uri}`;
        const volumnID = `volume-${uri}`;
        const playlistID = `playlist-${uri}`;
        const isPlaying = players[uri] && players[uri]['playing'];
        const status = isPlaying ? 'fa fa-pause-circle-o pauseBtn' : 'fa fa-play-circle-o playBtn';
        const startTime = this.millisToMinsAndSecs(this.state.position);
        const endTime = this.millisToMinsAndSecs(duration);
        return (
            ((players[uri] && !players[uri]['ready'])
                ? <div className="playerContainer noPlayer">Loading...</div>
                : (
                    <div className="playerContainer">
                        <div className="songControls">
                            <div className="playBtn">
                                <i
                                    onClick={() => this.onPlayClick(this.state.position)}
                                    className={'fa playBtn' + status}
                                    aria-hidden="true"
                                />
                            </div>
                            <div className="trackerInline">
                                <PlayTracker
                                    startTime={startTime}
                                    endTime={endTime}
                                    id={seekerID + 'Inline'}
                                    duration={duration}
                                    handleSeekBar={this.handleSeekBar}
                                />
                            </div>
                            <div className="volumeContainer">
                                <i className="fa fa-volume-up" aria-hidden="true" />
                                <input
                                    type="range"
                                    step="1"
                                    id={volumnID}
                                    className="volume"
                                    min="0"
                                    max="100"
                                    defaultValue="50"
                                    onInput={e => this.updateVolume(e.target.value, volumnID)}
                                />
                            </div>
                            <div
                                role="button"
                                onMouseEnter={() => { this.handleOpenPlaylist(playlistID); }}
                                onMouseLeave={() => { this.handleClosePlaylist(playlistID); }}
                            >
                                <span
                                    className="iconify"
                                    data-icon="ic-baseline-playlist-add"
                                    data-inline="false"
                                />
                            </div>
                            <div
                                onMouseEnter={() => { this.handleEnterPlaylist(playlistID); }}
                                onMouseLeave={() => { this.handleLeavePlaylist(playlistID); }}
                                className="showPlaylists"
                                id={playlistID}
                                style={{ display: 'none' }}
                            >
                                <Playlist uri={uri} playlists={this.state.currPlaylists} />
                            </div>
                        </div>
                        <div className="trackerBlock">
                            <PlayTracker
                                startTime={startTime}
                                endTime={endTime}
                                id={seekerID + 'Block'}
                                duration={duration}
                                handleSeekBar={this.handleSeekBar}
                            />
                        </div>
                    </div>
                )
            )
        );
    }
}

const mapStateToProps = (state) => {
    return {
        players: state.players,
        tokenInfo: state.token,
        profile: state.profileInfo,
        playlists: state.playlists
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updatePlayer: (players) => {
            dispatch(updatePlayers(players));
        },
        updatePlaylists: (playlists) => {
            dispatch(updatePlaylists(playlists));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Player);

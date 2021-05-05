import React, { Component } from 'react';
import { connect } from 'react-redux';
import platform from 'platform';
import Playlist from './Playlist';
import PlayTracker from './PlayTracker';
import { updateSongs, updatePlaylists } from '../store';
import '../style/player.css';

class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: 0,
            volume: 50,
            showPlaylist: false,
            currPlaylists: [],
            token: '',
            profileId: null

        };
        this.handleSeekBar = this.handleSeekBar.bind(this);
        this.handleOpenPlaylist = this.handleOpenPlaylist.bind(this);
        this.handleClosePlaylist = this.handleClosePlaylist.bind(this);
        this.handleEnterPlaylist = this.handleEnterPlaylist.bind(this);
        this.handleLeavePlaylist = this.handleLeavePlaylist.bind(this);
    }

    componentDidMount() {
        const currSongs = this.getCurrSongs();
        this.props.updateSongs(currSongs);
        const key = `Spotify_${platform.name}`;
        const storage = JSON.parse(localStorage.getItem(key))
            ? JSON.parse(localStorage.getItem(key)) : {};

        this.setState({
            profileId: storage.profileInfo.id,
        });
        this.getPlaylists();
        this.props.spotifyPlayer.on('player_state_changed', (state) => { this.onStateChanged(state); });
    }

    componentWillUnmount() {
        if (this.props.spotifyPlayer) {
            this.pause({
                playerInstance: this.props.spotifyPlayer,
            });
            this.movePlayer();
        }
    }

    onPlayClick(position) {
        const uri = this.props.uri;
        const song = this.props.songs[uri];
        const player = this.props.spotifyPlayer;
        if (!song['playing']) {
            this.play({
                playerInstance: player,
                spotify_uri: uri,
                position
            });
            clearInterval(song['playTimerInterval']);
            song['playTimerInterval'] = setInterval(() => {
                this.playTimer(this.state.position, uri);
            }, 1000);
            this.updateVolume(this.state.volume, `volume-${uri}`);
        } else {
            this.pause({
                playerInstance: player,
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
            const currSongs = { ...this.props.songs };
            const uri = track_window.current_track.uri;
            const songs = {};
            Object.keys(currSongs).forEach((elem) => {
                if (elem !== uri || paused) {
                    clearInterval(currSongs[elem]['playTimerInterval']);
                }
                songs[elem] = {};
                songs[elem]['playing'] = (elem === uri) ? !paused : false;
                songs[elem]['duration'] = currSongs[elem]['duration'];
                songs[elem]['playTimerInterval'] = (elem === uri) ? currSongs[elem]['playTimerInterval'] : null;
                songs[elem]['position'] = (elem === uri) ? position : currSongs[elem]['position'];
            });
            this.props.updateSongs(songs);
        }
    }

    setVolume({
        volume,
        playerInstance: {
            _options: {
                getOAuthToken,
            }
        }
    }) {
        getOAuthToken((access_token) => {
            fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}&device_id=${this.props.deviceID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`
                },
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    play({
        spotify_uri,
        position,
        playerInstance: {
            _options: {
                getOAuthToken,
            }
        }
    }) {
        getOAuthToken((access_token) => {
            fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.props.deviceID}`, {
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
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    pause({
        playerInstance: {
            _options: {
                getOAuthToken,
            }
        }
    }) {
        getOAuthToken((access_token) => {
            fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${this.props.deviceID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`
                },
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    movePlayer() {
        fetch('', {
            method: 'PUT'
        }).catch((err) => {
            console.log(err);
        });
    }

    updateVolume(volume, id) {
        this.moveSlider(id, volume, '#212121');
        this.setState({ volume: Number(volume) });
        this.setVolume({
            volume,
            playerInstance: this.props.spotifyPlayer,
            currPlayList: []
        });
    }

    playTimer(currPosition, uri) {
        const song = this.props.songs[uri];
        if (currPosition >= (Math.floor(song['duration'] / 1000) * 1000) - 2000) {
            clearInterval(song['playTimerInterval']);
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
        const roundDown = (Math.floor(event.target.value / 1000) * 1000) - 5000;
        const value = roundDown < 0 ? 0 : Math.floor(roundDown);
        const uri = this.props.uri;
        const songs = this.props.songs;
        const isPlaying = songs[uri] && songs[uri]['playing'];
        if (isPlaying) {
            this.play({
                spotify_uri: uri,
                position: value,
                playerInstance: this.props.spotifyPlayer
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
        const { token, profileId } = this.state;
        fetch(`https://api.spotify.com/v1/users/${profileId}/playlists`, {
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
                if (playlist.owner.id === profileId) {
                    userPlaylists.push(playlist);
                }
            });
            this.props.updatePlaylists(userPlaylists);
            this.setState({ currPlaylists: userPlaylists });
        }).catch((err) => {
            console.log(err);
        });
    }

    getCurrSongs() {
        const currSongs = { ...this.props.songs };
        const songList = {};
        Object.keys(currSongs).forEach((elem) => {
            songList[elem] = {};
            songList[elem]['playing'] = false;
            songList[elem]['duration'] = currSongs[elem]['duration'];
            songList[elem]['playTimerInterval'] = null;
            songList[elem]['position'] = 0;
        });
        return songList;
    }

    render() {
        if (!Object.keys(this.props.songs).length) return null;
        const songs = this.props.songs;
        const uri = this.props.uri;
        const duration = songs[uri] ? songs[uri]['duration'] : 0;
        const seekerID = `seeker-${uri}`;
        const volumnID = `volume-${uri}`;
        const playlistID = `playlist-${uri}`;
        const isPlaying = songs[uri] && songs[uri]['playing'];
        const status = isPlaying ? 'fa fa-pause-circle-o pauseBtn' : 'fa fa-play-circle-o playBtn';
        const startTime = this.millisToMinsAndSecs(this.state.position);
        const endTime = this.millisToMinsAndSecs(duration);
        return (
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
        );
    }
}

const mapStateToProps = (state) => {
    return {
        songs: state.songs,
        playlists: state.playlists,
        spotifyPlayer: state.spotifyPlayer
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateSongs: (songs) => {
            dispatch(updateSongs(songs));
        },
        updatePlaylists: (playlists) => {
            dispatch(updatePlaylists(playlists));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Player);

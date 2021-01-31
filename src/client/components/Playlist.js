import React, { Component } from 'react';
import { connect } from 'react-redux';
import NewPlaylist from './NewPlaylist';
import '../style/playlist.css';

class Playlist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModule: false,
        };
        this.handleCreatePlaylist = this.handleCreatePlaylist.bind(this);
        this.handleAddToPlaylist = this.handleAddToPlaylist.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onClickOutside = this.onClickOutside.bind(this);
    }

    handleCreatePlaylist() {
        this.setState({ showModule: true });
        this.toggleScrollLock();
    }

    closeModal() {
        this.setState({ showModule: false });
        this.toggleScrollLock();
    }

    onClickOutside(event) {
        if (this.modal && this.modal.contains(event.target)) return;
        this.closeModal();
    }

    toggleScrollLock() {
        document.querySelector('html').classList.toggle('scroll-lock');
    }

    handleAddToPlaylist(playlist = '') {
        fetch(`https://api.spotify.com/v1/playlists/${playlist}/tracks?`, {
            method: 'POST',
            body: JSON.stringify(
                {
                    uris: [this.props.uri]
                }
            ),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.props.tokenInfo.token}`
            },
        }).catch((err) => {
            console.log(err);
        });
    }

    render() {
        return (
            <div className="playlistsContainer">
                <div
                    className="playlist"
                    role="button"
                    onClick={() => this.handleCreatePlaylist()}
                >
                    New Playlist
                </div>
                {this.state.showModule ? (
                    <NewPlaylist
                        uri={this.props.uri}
                        modalRef={n => (this.modal = n)}
                        closeModal={this.closeModal}
                        onClickOutside={this.onClickOutside}
                        addSongToPlaylist={this.handleAddToPlaylist}
                    />
                ) : null}
                <hr />
                {this.props.playlists.map((playlist) => {
                    return (
                        <div
                            className="playlist"
                            role="button"
                            onClick={() => this.handleAddToPlaylist(playlist.id)}
                            key={playlist.id}
                        >
                            {playlist.name}
                        </div>
                    );
                })}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        tokenInfo: state.token
    };
};

export default connect(mapStateToProps, null)(Playlist);

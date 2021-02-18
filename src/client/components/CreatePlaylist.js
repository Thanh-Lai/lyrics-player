import React, { Component } from 'react';
import { connect } from 'react-redux';
import imageCompression from 'browser-image-compression';
import platform from 'platform';
import defaultImage from '../../../public/images/default-image.png';
import { updatePlaylists } from '../store';
import '../style/playlist.css';

class CreatePlaylist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: '',
            imagePreviewURL: '',
            name: '',
            description: '',
            profileId: null,
            token: ''
        };
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const key = `Spotify_${platform.name}`;
        const storage = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : {};
        this.setState({
            profileId: storage.profileInfo.id,
            token: storage.tokenInfo.token
        });
    }

    async handleImageChange(event) {
        event.preventDefault();
        let file = event.target.files[0];
        if (file.size >= 250000) {
            const options = {
                maxSizeMB: 0.20,
                maxWidthOrHeight: 1024
            };
            file = await imageCompression(file, options);
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result;
            const base64String = result
                .replace('data:', '')
                .replace(/^.+,/, '');
            this.setState({
                image: base64String,
                imagePreviewURL: result,
            });
        };
        reader.readAsDataURL(file);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        const {
            name,
            description,
            image,
            token,
            profileId
        } = this.state;
        fetch(`https://api.spotify.com/v1/users/${profileId}/playlists`, {
            method: 'POST',
            body: JSON.stringify(
                {
                    name: name || 'Lyrics Player Playlist',
                    description,
                }
            ),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            return res.json();
        }).then((data) => {
            if (image) {
                this.setPlaylistImage(profileId, data.id, image, token);
            }
            const currPlaylists = this.props.playlists;
            currPlaylists.unshift(data);
            this.props.updatePlaylists(currPlaylists);
            this.props.addSongToPlaylist(data.id);
            this.props.closeModal();
        }).catch((err) => {
            console.log(err);
        });
    }

    setPlaylistImage(userID, playlist, image, token) {
        fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlist}/images`, {
            method: 'PUT',
            body: image,
            json: true,
            headers: {
                'Content-Type': 'image/jpeg',
                Authorization: `Bearer ${token}`
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    render() {
        const uploadID = `fileUpload-${this.props.uri}`;
        const { imagePreviewURL } = this.state;
        return (
            <form onSubmit={e => this.handleSubmit(e)}>
                <div style={{ marginBottom: '10px' }}>New Spotify Playlist</div>
                <div className="formGroup">
                    <div className="uploadImage">
                        <label htmlFor={uploadID} className="custom-file-upload formField">
                            <i className="fa fa-cloud-upload" style={{ paddingRight: '5px' }} />
                            Choose Image
                        </label>
                        <input
                            className="formField"
                            id={uploadID}
                            type="file"
                            accept="image/jpeg"
                            onChange={e => this.handleImageChange(e)}
                        />
                        <img className="playlistImage formField" alt="playlistImage" src={imagePreviewURL || defaultImage} />
                    </div>
                    <div>
                        <div className="formField">
                            <label htmlFor="name">Name</label>
                            <input
                                style={{ paddingLeft: '5px' }}
                                name="name"
                                className="form-control playListName"
                                onKeyUp={e => this.handleChange(e)}
                                placeholder="Lyrics Player Playlist"
                            />
                        </div>
                        <div className="formField">
                            <label htmlFor="description">Description</label>
                            <textarea
                                name="description"
                                type="description"
                                className="form-control description"
                                placeholder="Give your playlist a catchy description"
                                onKeyUp={e => this.handleChange(e)}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <button className="form-control btn btn-primary newPlaylistBtn" type="submit">
                        Create and Add
                    </button>
                </div>
            </form>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        playlists: state.playlists,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updatePlaylists: (playlists) => {
            dispatch(updatePlaylists(playlists));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreatePlaylist);

import React, { Component } from 'react';
import axios from 'axios';
import Inputs from './components/Inputs';
import './app.css';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            matchedSongs: {}
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const songInfo = {};
        const { value } = event.target.inputValue;
        const uriEncode = encodeURI(value);
        const corsAnywhere = 'https://cors-anywhere.herokuapp.com';
        const geniusAPI = 'https://genius.com/api';
        axios.get(`${corsAnywhere}/${geniusAPI}/search/lyrics?q=${uriEncode}&per_page=20`)
            .then((res) => {
                const geniusResults = res.data.response.sections[0].hits;
                for (let i = 0; i < geniusResults.length; i++) {
                    const hit = geniusResults[i];
                    const lyricsSnippet = hit.highlights[0].value;
                    const songApiPath = hit.result.api_path;
                    const isMatch = lyricsSnippet.toLowerCase().includes(value.toLowerCase());
                    // Future task: compare value with snippet and display songs with 80% match
                    // Match words like fallin' vs fallin vs falling, & vs and
                    // For now, match is based on exact match
                    if (!isMatch) {
                        continue;
                    }
                    axios.get(`${corsAnywhere}/${geniusAPI}${songApiPath}`)
                        .then((songRes) => {
                            const currSong = songRes.data.response.song;
                            if (currSong.apple_music_id != null) {
                                const currSongID = currSong.id;
                                const album = currSong.album;
                                songInfo[currSongID] = {};
                                songInfo[currSongID]['id'] = currSongID;
                                songInfo[currSongID]['title'] = currSong.title;
                                songInfo[currSongID]['artist'] = album ? album.artist.name : null;
                                songInfo[currSongID]['album'] = album ? album.name : null;
                                songInfo[currSongID]['releaseDate'] = currSong.release_date;
                                songInfo[currSongID]['image'] = currSong.header_image_thumbnail_url;
                                songInfo[currSongID]['lyrics'] = currSong.share_url;
                            }
                        })
                        .catch(err => console.log(err));
                    if (songInfo[hit.result.id]) {
                        songInfo[hit.result.id]['type'] = hit.highlights.index;
                        songInfo[hit.result.id]['snippet'] = lyricsSnippet;
                    }
                }
            })
            .catch(err => console.log(err));
        console.log('songInfo', songInfo);
        this.setState({ matchedSongs: songInfo });
        console.log('sate', this.state);
    }

    render() {
        console.log('render', this.state);
        return (
            <div>
                hello worldd
                <Inputs onSubmit={this.handleSubmit} />
            </div>
        );
    }
}

import React from 'react';
import platform from 'platform';
import Player from './Player';
import NoPlayer from './NoPlayer';
import '../style/songContainers.css';

export default function Container({ songInfo }) {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const key = `Spotify_${platform.name}`;
    const token = (JSON.parse(localStorage.getItem(key)) && JSON.parse(localStorage.getItem(key)).tokenInfo)
        ? JSON.parse(localStorage.getItem(key)).tokenInfo : 'No Token';
    const noToken = (token === 'No Token');
    return (
        <div className="songContainer">
            <div className="songContent">
                <strong>Title:&nbsp;</strong>
                {songInfo.title}
            </div>
            <div className="songContent">
                <strong>Artist:&nbsp;</strong>
                {songInfo.artist}
            </div>
            <div className="songContent">
                <strong>Album:&nbsp;</strong>
                {songInfo.album}
            </div>
            <div className="songContent">
                <strong>Release Date:&nbsp;</strong>
                {songInfo.releaseDate}
            </div>
            <div className="songContent">
                <strong>Lyrics Snippet:&nbsp;</strong>
                {songInfo.snippet}
            </div>
            <div className="songContent">
                <strong>Lyrics:&nbsp;</strong>
                <a className="lyricsUrl" value="songInfo.lyricsURL" href={songInfo.lyricsURL} target="_blank" rel="noreferrer">{songInfo.lyricsURL}</a>
            </div>
            <br />
            {(isSafari || noToken || !songInfo.spotifyUri)
                ? <NoPlayer isSafari={isSafari} token={token} />
                : <Player uri={songInfo.spotifyUri} />
            }
        </div>
    );
}

import React from 'react';

export default function Container({ songInfo }) {
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
                <strong>Lyric Snippet:&nbsp;</strong>
                {songInfo.snippet}
            </div>
            <div className="songContent">
                <strong>Lyrics:&nbsp;</strong>
                <a value="songInfo.lyricsURL" href={songInfo.lyricsURL} target="_blank" rel="noreferrer">{songInfo.lyricsURL}</a>
            </div>
            <br />
        </div>
    );
}
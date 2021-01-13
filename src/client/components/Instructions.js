import React from 'react';
import '../style/searchBox.css';

export default function Instructions() {
    return (
        <div id="instructionText">
            <strong>Text Search: </strong>
            Search by song title or lyrics.
            <br />
            <div className="breakSpace" />
            <strong>Audio Search: </strong>
            Coming Soon.
            <br />
            <div className="breakSpace" />
            <strong>Spotify Player: </strong>
            Log into your Spotify account to use the Spotify player and add songs to your playlists.
            <br />
            <div className="breakSpace" />
            <strong>Note: </strong>
            The Spotify Web Player is in Beta. The content and functionality may change without warning in future versions.
            Please report should the player no longer works.
        </div>
    );
}

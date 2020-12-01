import React from 'react';

export default function NoPlayer({ token }) {
    return (
        <div id="noPlayer" className="song-player-container">
            {
                token === 'No Token'
                    ? <div>Log in to play song</div>
                    : <div>No track found</div>
            }
        </div>
    );
}

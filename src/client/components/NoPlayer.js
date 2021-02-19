import React from 'react';
import '../style/player.css';

export default function NoPlayer({ token, isSafari, product }) {
    let noPlayer = null;
    switch (true) {
    case isSafari:
        noPlayer = <div>Safari not supported</div>;
        break;
    case token === 'No Token' && !isSafari:
        noPlayer = <div>Log in to play song</div>;
        break;
    case product === 'open':
        noPlayer = <div>A Spotify premium account is required</div>;
        break;
    default:
        noPlayer = <div>No track found</div>;
    }
    return (
        <div className="playerContainer noPlayer">
            {
                noPlayer
            }
        </div>
    );
}

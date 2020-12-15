import React from 'react';

export default function NoPlayer({ token, isSafari }) {
    let noPlayer = <div>No track found</div>;

    switch (true) {
    case isSafari:
        noPlayer = <div>Safari not supported</div>;
        break;
    case token === 'No Token' && !isSafari:
        noPlayer = <div>Log in to play song</div>;
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

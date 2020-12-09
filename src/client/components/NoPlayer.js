import React from 'react';

export default function NoPlayer({ token }) {
    return (
        <div className="playerContainer noPlayer">
            {
                token === 'No Token'
                    ? <div>Log in to play song</div>
                    : <div>No track found</div>
            }
        </div>
    );
}

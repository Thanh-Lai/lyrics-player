import React from 'react';
import { connect } from 'react-redux';
import Player from './Player';
import NoPlayer from './NoPlayer';

function Container({ songInfo, token }) {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const noToken = (token === 'No Token' || token === '');
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
            {(isSafari || noToken || !songInfo.spotifyUri)
                ? <NoPlayer isSafari={isSafari} token={token} />
                : <Player logged={token} token={token} uri={songInfo.spotifyUri} />
            }
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        token: state.token
    };
};

export default connect(mapStateToProps, null)(Container);

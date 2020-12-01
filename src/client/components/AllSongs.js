import React, { useEffect } from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import { connect } from 'react-redux';
import Container from './Container';
import { updatePlayers } from '../store';

const playList = {};

function AllSongs({
    matchedResults, updatePlayersOnMount, token, clicked
}) {
    const { promiseInProgress } = usePromiseTracker();
    Object.values(matchedResults).forEach((elem) => {
        if (elem.id && elem.spotifyUri) {
            playList[elem.spotifyUri] = {};
            playList[elem.spotifyUri]['playing'] = false;
        }
    });

    // component mount hook
    useEffect(() => {
        updatePlayersOnMount(playList);
    }, []);
    const orderedSongs = Object.values(matchedResults).sort((a, b) => a.levenshteinDistance - b.levenshteinDistance);
    if (promiseInProgress) return (<div className="loaderRing" />);
    if (clicked && !orderedSongs.length) return (<div className="songContainer" id="noData">No Song Found</div>);
    return (
        <div id="containers">
            {orderedSongs.map((elem) => {
                const currSong = elem.id ? matchedResults[elem.id] : false;
                if (currSong) {
                    return <Container token={token} key={elem.id} songInfo={currSong} />;
                }
            })}
        </div>
    );
}

const mapDispatchToProps = (dispatch) => {
    return {
        updatePlayersOnMount: (players) => {
            dispatch(updatePlayers(players));
        }
    };
};

export default connect(null, mapDispatchToProps)(AllSongs);

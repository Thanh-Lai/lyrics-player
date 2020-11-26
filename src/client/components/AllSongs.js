import React from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import Container from './Container';

export default function AllSongs({ matchedResults, clicked, token }) {
    const { promiseInProgress } = usePromiseTracker();
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

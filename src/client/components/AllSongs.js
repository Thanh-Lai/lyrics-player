import React from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import Container from './Container';

export default function Spinner({ matchedResults, clicked }) {
    const { promiseInProgress } = usePromiseTracker();
    if (promiseInProgress) return (<div className="loaderRing" />);
    if (clicked && !Object.keys(matchedResults).length) return (<div className="songContainer" id="noData">No Data Found</div>);
    return (
        <div id="containers" style={{ display: 'block' }}>
            {Object.keys(matchedResults).map((key) => {
                const currSong = matchedResults[key];
                if (currSong.id) {
                    return <Container key={key} songInfo={currSong} />;
                }
            })}
        </div>
    );
}

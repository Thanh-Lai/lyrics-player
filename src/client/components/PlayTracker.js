import React from 'react';
import '../style/player.css';

export default function PlayTracker({
    startTime, endTime, id, duration, handleSeekBar
}) {
    return (
        <div className="playTracker">
            <div className="playTimes">{startTime}</div>
            <input
                type="range"
                step="1"
                id={id}
                className="seekBar"
                defaultValue="0"
                readOnly
                min="0"
                max={duration}
                onMouseUp={e => handleSeekBar(e, id)}
            />
            <div className="playTimes">{endTime}</div>
        </div>
    );
}

import React from 'react';

export default function TextSearch({ onSubmit }) {
    return (
        <form onSubmit={event => onSubmit(event)}>
            <input id="inputValue" type="text" />
            <input type="submit" value="Submit" />
        </form>
    );
}

/**
 * ACTION TYPES
 */
const UPDATE_SONGS = 'UPDATE_SONGS';
/**
 * INITIAL STATE
 */
const initialSongs = {};

/**
 * ACTION CREATORS
 */
export const updateSongs = songs => ({ type: UPDATE_SONGS, songs });

/**
 * REDUCER
 */
export default function (state = initialSongs, action) {
    switch (action.type) {
    case UPDATE_SONGS:
        return action.songs;
    default:
        return state;
    }
}

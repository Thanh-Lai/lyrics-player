/**
 * ACTION TYPES
 */
const UPDATE_PLAYLISTS = 'UPDATE_PLAYLISTS';
/**
 * INITIAL STATE
 */
const initialPlaylists = [];

/**
 * ACTION CREATORS
 */
export const updatePlaylists = playlists => ({ type: UPDATE_PLAYLISTS, playlists });

/**
 * REDUCER
 */
export default function (state = initialPlaylists, action) {
    switch (action.type) {
    case UPDATE_PLAYLISTS:
        return action.playlists;
    default:
        return state;
    }
}

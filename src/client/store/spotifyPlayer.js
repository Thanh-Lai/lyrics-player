/**
 * ACTION TYPES
 */
const UPDATE_SPOTIFY_PLAYER = 'UPDATE_SPOTIFY_PLAYER';
/**
  * INITIAL STATE
  */
const spotifyPlayer = {};

/**
  * ACTION CREATORS
  */
export const updateSpotifyPlayer = player => ({ type: UPDATE_SPOTIFY_PLAYER, player });

/**
  * REDUCER
  */
export default function (state = spotifyPlayer, action) {
    switch (action.type) {
    case UPDATE_SPOTIFY_PLAYER:
        return action.player;
    default:
        return state;
    }
}

/**
 * ACTION TYPES
 */
const UPDATE_PLAYERS = 'UPDATE_PLAYERS';
/**
 * INITIAL STATE
 */
const initialPlayers = {};

/**
 * ACTION CREATORS
 */
export const updatePlayers = players => ({ type: UPDATE_PLAYERS, players });

/**
 * REDUCER
 */
export default function (state = initialPlayers, action) {
    switch (action.type) {
    case UPDATE_PLAYERS:
        return action.players;
    default:
        return state;
    }
}

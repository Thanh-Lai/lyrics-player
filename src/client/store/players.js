/**
 * ACTION TYPES
 */
// const GET_PLAYERS = 'GET_PLAYERS';
const UPDATE_PLAYERS = 'UPDATE_PLAYERS';
/**
 * INITIAL STATE
 */
const initalPlayers = {};

/**
 * ACTION CREATORS
 */
// export const getPlayers = () => ({ type: GET_PLAYERS });
export const updatePlayers = players => ({ type: UPDATE_PLAYERS, players });

/**
 * REDUCER
 */
export default function (state = initalPlayers, action) {
    // console.log('reducer', state, action);
    switch (action.type) {
    case UPDATE_PLAYERS:
        return action.players;
    default:
        return state;
    }
}

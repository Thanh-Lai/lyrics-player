/**
 * ACTION TYPES
 */
const UPDATE_TOKEN = 'UPDATE_TOKEN';
/**
 * INITIAL STATE
 */
const initialState = {};

/**
 * ACTION CREATORS
 */
export const updateToken = token => ({ type: UPDATE_TOKEN, token });

/**
 * REDUCER
 */
export default function (state = initialState, action) {
    switch (action.type) {
    case UPDATE_TOKEN:
        return action.token;
    default:
        return state;
    }
}

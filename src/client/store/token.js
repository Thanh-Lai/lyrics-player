/**
 * ACTION TYPES
 */
const UPDATE_TOKEN = 'UPDATE_TOKEN';
/**
 * INITIAL STATE
 */
const initialToken = '';

/**
 * ACTION CREATORS
 */
export const updateToken = token => ({ type: UPDATE_TOKEN, token });

/**
 * REDUCER
 */
export default function (state = initialToken, action) {
    switch (action.type) {
    case UPDATE_TOKEN:
        return action.token;
    default:
        return state;
    }
}

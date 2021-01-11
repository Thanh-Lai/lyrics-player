/**
 * ACTION TYPES
 */
const UPDATE_PROFILE = 'UPDATE_PROFILE';
/**
 * INITIAL STATE
 */
const initialState = {};

/**
 * ACTION CREATORS
 */
export const updateProfileInfo = profileInfo => ({ type: UPDATE_PROFILE, profileInfo });

/**
 * REDUCER
 */
export default function (state = initialState, action) {
    switch (action.type) {
    case UPDATE_PROFILE:
        return action.profileInfo;
    default:
        return state;
    }
}

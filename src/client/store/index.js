import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import players from './players';
import token from './token';
import profileInfo from './profileInfo';
import playlists from './playlists';


const reducer = combineReducers({
    players, token, profileInfo, playlists
});
const middleware = composeWithDevTools(
    applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
);
const store = createStore(reducer, middleware);

export default store;
export * from './players';
export * from './token';
export * from './profileInfo';
export * from './playlists';

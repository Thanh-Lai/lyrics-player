import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import players from './players';
import playlists from './playlists';
import spotifyPlayer from './spotifyPlayer';


const reducer = combineReducers({
    players, playlists, spotifyPlayer
});
const middleware = composeWithDevTools(
    applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
);
const store = createStore(reducer, middleware);

export default store;
export * from './players';
export * from './playlists';
export * from './spotifyPlayer';

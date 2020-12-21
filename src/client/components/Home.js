import React, { Component } from 'react';
import axios from 'axios';
import { trackPromise } from 'react-promise-tracker';
import { connect } from 'react-redux';
import SearchBox from './SearchBox';
import AllSongs from './AllSongs';
import { updatePlayers, updateToken } from '../store';
import '../app.css';
import { API_KEY } from '../../../secrets';

class Home extends Component {
    isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            matchedResults: {},
            clicked: false,
            timer: 0
        };
        this.refreshTimer = null;
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.isMounted = true;
        this.refreshTimer = setInterval(() => this.checkRefreshTimer(), 1000);
        axios.get('http://localhost:8888/auth/accessToken', {
            headers: {
                Authorization: API_KEY
            }
        })
            .then((data) => {
                if (this.isMounted) {
                    const tokenData = {
                        token: data.data,
                        timestamp: Date.now()
                    };
                    this.props.updateToken(tokenData);
                }
            });
    }

    componentWillUnmount() {
        this.isMounted = false;
        clearInterval(this.refreshTimer);
    }

    checkRefreshTimer() {
        if (this.state.timer >= 3590) {
            axios.get('http://localhost:8888/auth/refreshToken', {
                headers: {
                    Authorization: API_KEY
                }
            })
                .then((data) => {
                    const tokenData = {
                        token: data.data,
                        timestamp: Date.now()
                    };
                    this.props.updateToken(tokenData);
                });
            this.setState({ timer: 0 });
        } else {
            this.setState(prevState => ({ timer: prevState.timer + 1 }));
        }
    }

    async handleSubmit(event) {
        const songOrLyric = document.getElementById('textType').value;
        event.preventDefault();
        const { value } = event.target.inputValue;
        if (!value) return;
        const uriEncodeInput = encodeURI(value);
        const result = await trackPromise(axios.get(`http://localhost:8888/textSearch?query=${uriEncodeInput}&type=${songOrLyric}`, {
            headers: {
                Authorization: API_KEY,
            }
        }));
        if (this.isMounted) {
            this.setState({
                matchedResults: result.data,
                clicked: true
            });
            const playList = {};
            Object.values(result.data).forEach((elem) => {
                if (elem.id && elem.spotifyUri) {
                    playList[elem.spotifyUri] = {};
                    playList[elem.spotifyUri]['ready'] = false;
                    playList[elem.spotifyUri]['duration'] = elem.duration;
                }
            });
            this.props.updatePlayersOnFetch(playList);
        }
    }

    render() {
        return (
            <div>
                <SearchBox onSubmit={this.handleSubmit} />
                <AllSongs clicked={this.state.clicked} matchedResults={this.state.matchedResults} />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updatePlayersOnFetch: (players) => {
            dispatch(updatePlayers(players));
        },
        updateToken: (token) => {
            dispatch(updateToken(token));
        }
    };
};

export default connect(null, mapDispatchToProps)(Home);

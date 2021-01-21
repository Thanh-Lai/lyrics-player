import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { updateProfileInfo } from './store';
import { API_KEY } from '../../secrets';
import Home from './components/Home';
import Contact from './components/Contact';
import Navbar from './components/Navbar';

class App extends Component {
    ENV = process.env.NODE_ENV === 'development' ? 'http://localhost:8888' : 'http://api.lyricsplayer.tk';

    constructor(props) {
        super(props);
        this.state = {
            init: false
        };
    }

    componentDidMount() {
        axios.get(this.ENV + '/auth/loginStatus', {
            headers: {
                Authorization: API_KEY
            }
        }).then((result) => {
            this.props.updateProfileInfo(result.data);
            this.setState({ init: true });
        });
    }

    render() {
        if (!this.state.init) return (null);
        return (
            <main>
                <Navbar />
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/contact" component={Contact} />
                    <Route component={Home} />
                </Switch>
            </main>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateProfileInfo: (players) => {
            dispatch(updateProfileInfo(players));
        }
    };
};

export default connect(null, mapDispatchToProps)(App);

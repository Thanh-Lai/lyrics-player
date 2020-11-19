import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Home, Contact } from './components';

export default function App() {
    return (
        <main>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/contact" component={Contact} />
                <Route component={Home} />
            </Switch>
        </main>
    );
}

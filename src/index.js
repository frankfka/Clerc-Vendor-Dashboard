import React from 'react';
import ReactDOM from 'react-dom';

import './global.scss'

import App from './App';

import Firebase, { FirebaseContext } from './components/Firebase';

// Render the main app wrapped with a firebase object
ReactDOM.render(
    <FirebaseContext.Provider value={new Firebase()}>
        <App />
    </FirebaseContext.Provider>,
    document.getElementById('root')
);


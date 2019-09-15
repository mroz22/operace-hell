import React from 'react';
import { render } from 'react-dom';
import * as firebase from 'firebase';
import App from './App';
import * as serviceWorker from './serviceWorker';

const firebaseConfig = {
    apiKey: 'AIzaSyAQJ_kFcCJMKmPBgD7tcmAygCFwllEpg5A',
    projectId: 'operacexxx',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
render(<App />, document.getElementById('main'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
import React from 'react';
import { render } from 'react-dom';
import * as firebase from 'firebase';
// import config from '../google-services.json';
import App from './App';

const firebaseConfig = {
    apiKey: 'AIzaSyAQJ_kFcCJMKmPBgD7tcmAygCFwllEpg5A',
    // authDomain: "project-id.firebaseapp.com",
    // databaseURL: config.project_info.firebase_url,
    projectId: 'operacexxx',
    // storageBucket: "project-id.appspot.com",
    // messagingSenderId: "sender-id",
    // appID: "app-id",
};

  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

render(<App />, document.getElementById('main'));
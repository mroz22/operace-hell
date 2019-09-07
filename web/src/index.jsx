import React from 'react';
import { render } from 'react-dom';
import * as firebase from 'firebase';
import App from './App';

const firebaseConfig = {
    apiKey: 'AIzaSyAQJ_kFcCJMKmPBgD7tcmAygCFwllEpg5A',
    projectId: 'operacexxx',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
render(<App />, document.getElementById('main'));
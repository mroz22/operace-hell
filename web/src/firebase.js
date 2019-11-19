import firebase from 'firebase/app';
import 'firebase/firestore'; // If using Firebase database
import 'firebase/storage';  // If using Firebase storage
import 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyAQJ_kFcCJMKmPBgD7tcmAygCFwllEpg5A',
    projectId: 'operacexxx',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export {
    firebase,
    db,
}
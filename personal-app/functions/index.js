// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const intervals = require('./src/interval');
const situations = require('./src/gameSituation');

admin.initializeApp();

exports.addUserRole = functions.auth.user().onCreate(async (user) => {
    const snapshot = await admin.firestore().collection("users").doc(user.uid).set({
        name: "Unknown soldier",
        status: {
            health: 100,
            radiation: 0,         
        },
    });
});

exports.eatPill = functions.https.onCall(async (data, context) => {
    const pill = data.pill;
    // Authentication / user information is automatically added to the request.
    const uid = context.auth.uid;

    const userRef = await admin.firestore().collection('users').doc(uid);
    const user = await userRef.get();

    if (data.color === 'blue') {
        userRef.set({
            name: user.data().name,
            status: {
                health: user.data().status.health,
                radiation: user.data().status.radiation - 10 > 0 ? user.data().status.radiation - 10 : 0,
            }
        })
    }
    if (data.color === 'red') {
        userRef.set({
            name: user.data().name,
            status: {
                health: user.data().status.health - 10 > 0 ? user.data().status.health - 10 : 0,
                radiation: user.data().status.radiation - 5 > 0 ? user.data().status.radiation - 5 : 0,
            }
        })
    }
    if (data.color === 'green') {
        // do nothing. placebo
    }
    
});

exports.runInterval = intervals.runInterval;
exports.resolveGameSituation = situations.resolveGameSituation;
// utils


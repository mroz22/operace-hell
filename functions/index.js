// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const intervals = require('./src/interval');
const situations = require('./src/gameSituation');

admin.initializeApp();
const MAX_CORRECT_PASSWORDS = 8;

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

exports.enterPassword = functions.https.onCall(async (data, context) => {
    
   
    if (data.pass1 === 'a' && data.pass2 === 'a') {
        const uid = context.auth.uid;
        const userRef = await admin.firestore().collection('users').doc(uid);
        let numberOfUsersWithCorrectPass = 0;
        await admin.firestore().collection('users').get().then((querySnapshot) => {
            return querySnapshot.forEach((doc) => {
                const userRef = db.collection('users').doc(doc.id);
                if (doc.data().status.enteredCorrectPassword) {
                    numberOfUsersWithCorrectPass++;
                }
            });
        })

        if (numberOfUsersWithCorrectPass < MAX_CORRECT_PASSWORDS) {
            await userRef.update(
                { 
                    'status.enteredCorrectPassword': true,
                }
            )
            return `spravne! vstoupil jsi. jeste zbyva ${MAX_CORRECT_PASSWORDS - numberOfUsersWithCorrectPass} mist`;
        } else {
            return 'heslo je spravne ale tajny bunkr je uz bohuzel plny. pozde! ted uz ti zbyba jen pokusit se prezit do nulte epochy.'
        }
    }
    return 'pip. pip.. pip... nic se nestalo :(';
});

exports.runInterval = intervals.runInterval;
exports.resolveGameSituation = situations.resolveGameSituation;

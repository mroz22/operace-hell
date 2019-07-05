// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
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

exports.runInterval = functions.pubsub.topic('interval').onPublish(async () => {
    // set game state in this tick
    console.log('run interval');

    const game = await admin.firestore().collection('game').doc('operacexxx').get();
    
    const currentRadiation = game.data().radiation;
    const currentRadiationChangeRate = game.data().radiationChangeRate;
    const ticksToRadiationChange = game.data().ticksToRadiationChange;

    // updated GAME

    if (ticksToRadiationChange === 0) {
        const nextRadiationChangeRate = getRadiationRateChange(1, 0.5);
        await admin.firestore().collection('game').doc('operacexxx').update({
            ticksToRadiationChange: getRandomInt(3, 6),
            radiationChangeRate: nextRadiationChangeRate,
        });    
    } else {
        let nextRadiation = currentRadiation + currentRadiationChangeRate;
        if (nextRadiation < 0) {
            nextRadiation = 0;
        }
        if (nextRadiation > 100) {
            nextRadiation = 100;
        }
        await admin.firestore().collection('game').doc('operacexxx').update({
            radiation: nextRadiation,
            ticksToRadiationChange: ticksToRadiationChange - 1,
        });
    }

    // updated USERS

    admin.firestore().collection('users').get().then((querySnapshot) => {
        return querySnapshot.forEach((doc) => {
            const userRef = admin.firestore().collection('users').doc(doc.id);
                    
            const currentUserRadiation = doc.data().status.radiation;
            const DOSE_MODIFIER = doc.data().status.protectiveSuiteOn ? 1000 : 100;
            if (currentUserRadiation < currentRadiation) {
                return userRef.update({
                    'status.radiation': currentUserRadiation + ((currentRadiation - currentUserRadiation) / DOSE_MODIFIER )
                });
            }
        });
    }).catch((err) => console.error(err));

    // updated BUNKERS

    return admin.firestore().collection('bunkers').get().then((querySnapshot) => {
        return querySnapshot.forEach((doc) => {
            const bunkerRef = admin.firestore().collection('bunkers').doc(doc.id);

            const bunker = doc.data();
            if ((bunker.numberOfUsers === 0 && bunker.oxygenGeneration === 0) || bunker.isDestroyed) {
                return;
            }

            let updatedOxygen = bunker.oxygen - (bunker.numberOfUsers * 0.1) + bunker.oxygenGeneration;
            if (updatedOxygen < 0) {
                bunkerRef.update({
                    isDestroyed: true,
                });
            } else if (updatedOxygen > bunker.oxygenCap) {
                updatedOxygen = bunker.oxygenCap;
            }

            bunkerRef.update({
                'oxygen': updatedOxygen,
            });
        });
    }).catch((err) => console.error(err));
});

// example of firestore trigger;
// exports.myFunctionName = functions.firestore
//     .document('users/marie').onWrite((change, context) => {
//       // ... Your code here
// });


// utils

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRadiationRateChange(max, growthProbability) {
    const rate = (getRandomInt(0, max) / 100)
    if (Math.random() > growthProbability) {
        rate * -1;
    }
    return rate;
}
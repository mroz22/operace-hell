// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const intervals = require('./src/interval');
const { beta, production } = require('./src/config');

const { getRandomInt, getRandomUniqueFromArray } = require('./src/utils');

admin.initializeApp();

const db = admin.firestore();

exports.addUserRole = functions.auth.user().onCreate(async (user) => {
    const snapshot = await admin.firestore().collection("users").doc(user.uid).set({
        name: "Unknown soldier",
        status: production.initialUserStatus,
    });
});

exports.enterPassword = functions.https.onCall(async (data, context) => {
    if (data.pass1 === 'a' && data.pass2 === 'a') {
        const uid = context.auth.uid;
        const userRef = db.collection('users').doc(uid);
        const gameRef = db.collection('game').doc('operacexxx');

        let numberOfUsersWithCorrectPass = 0;
        await db.collection('users').get().then((querySnapshot) => {
            return querySnapshot.forEach((doc) => {
                const userRef = db.collection('users').doc(doc.id);
                if (doc.data().status.enteredCorrectPassword) {
                    numberOfUsersWithCorrectPass++;
                }
            });
        })

        const game = await gameRef.get().then((doc) => {
            return doc.data();
        });

        if (numberOfUsersWithCorrectPass < game.MAX_SURVIVORS) {
            await userRef.update(
                { 
                    'status.enteredCorrectPassword': true,
                }
            )
            return `spravne! vstoupil jsi. jeste zbyva ${game.MAX_SURVIVORS - numberOfUsersWithCorrectPass} mist`;
        } else {
            return 'heslo je spravne ale tajny bunkr je uz bohuzel plny. pozde! ted uz ti zbyba jen pokusit se prezit do nulte epochy.'
        }
    }
    return 'pip. pip.. pip... nic se nestalo :(';
});


exports.surgery = functions.https.onCall(async (data, context) => {
    if (!data.targetRoleId) return 'missing targetRoleId';
    if (!data.level) return 'missing level param';
    
    const uid = context.auth.uid;
    const userRef = db.collection('users').doc(data.targetRoleId);
    const gameRef = db.collection('game').doc('operacexxx');
    let nextStatus = {};
    const random = getRandomInt(1,10);

    if (data.level === 'heavy') {
        if (random === 10) {
            nextStatus['status.injury'] = 'lethal';
            await userRef.update(nextStatus);
            return 'Operace se nezdarila, pacient zemrel';
        
        } else if (random < 10 && random > 3) {
            const role = await userRef.get().then((doc) => {
                return doc.data();
            });
            const game = await gameRef.get().then((doc) => {
                return doc.data();
            });
            const nextInjury = getRandomUniqueFromArray(role.status.permanentInjuries, game.PERMANENT_INJURIES);
            nextStatus['status.injury'] = 'none';
            if (nextInjury) {
                nextStatus['status.permanentInjuries'] = [...role.status.permanentInjuries, nextInjury] 
            }
            await userRef.update(nextStatus);
            return 'Operace se zdarila s trvalymi nasledky';
    
        } else {
            nextStatus['status.injury'] = 'none';
            await userRef.update(nextStatus);
            return 'Operace se zdarila bez nasledku';
        }
    }

    if (data.level === 'light') {
        if (random <= 10 && random > 2) {
            nextStatus['status.injury'] = 'none';
            await userRef.update(nextStatus);
            return 'Osetreni se zdarilo bez nasledku';
        } else {
            const role = await userRef.get().then((doc) => {
                return doc.data();
            });
            const game = await gameRef.get().then((doc) => {
                return doc.data();
            });
            const nextInjury = getRandomUniqueFromArray(role.status.permanentInjuries, game.PERMANENT_INJURIES);
            nextStatus['status.injury'] = 'none';
            if (nextInjury) {
                nextStatus['status.permanentInjuries'] = [...role.status.permanentInjuries, nextInjury] 
            }
            await userRef.update(nextStatus);
            return 'Osetreni se zdarilo s trvalymi nasledky';
        }
    }

    return 'wrong data.level param, nic se nestalo';
    
});

exports.resetGame = functions.https.onCall(async (data, context) => {
    console.log('restarting game data');
    
    // only meee
    // if (context.auth.uid !== '3u4h1Fl5zzbiD3Fc2KahEEvKVx82') {
    //     return 'nemas pravo'
    // }

    if (!data.type || (data.type !== 'beta' && data.type !== 'production')) {
        return 'you must specify either "production" or "beta" in params';
    }
    const config = data.type === 'production' ? production : beta;
    
    console.log('data.type', data.type);
    console.log('config');
    
    console.log(config);

    await db.collection('users').get().then((querySnapshot) => {
        return querySnapshot.forEach((doc) => {
            const userRef = db.collection('users').doc(doc.id);
            return userRef.update({ status: config.initialUserStatus});
        });
    }).catch((err) => console.error(err));

    await db.collection('bunkers').get().then((querySnapshot) => {
        return querySnapshot.forEach((doc) => {
            const bunkerRef = db.collection('bunkers').doc(doc.id);
            return bunkerRef.update({
                'isDestroyed': false,
                'oxygen': doc.data().oxygenCap,
            });
        });
    }).catch((err) => console.error(err));

    const gameRef = db.collection('game').doc('operacexxx');
    await gameRef.update(config.initialGame);
    
    return 'hra resetovana';

});

exports.togglePause = functions.https.onCall(async (data, context) => {
    const gameRef = db.collection('game').doc('operacexxx');
    const game = await gameRef.get().then((doc) => {
        return doc.data();
    });
    await gameRef.update({ isPaused: !game.isPaused });
    return 'hotovo';
});

exports.runInterval = intervals.runInterval;

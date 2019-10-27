const functions = require('firebase-functions');
const admin = require('firebase-admin');
const utils = require('./utils');
const radiation = require('./config/radiation');

const getRadiationForEpoch = (epoch) => {
    console.log('epoch', epoch);
    const key = Object.keys(radiation).reverse().find(k => k <= epoch);
    console.log('key', key);
    console.log('radiation[key]', radiation[key])
    return radiation[key];
};

exports.runInterval = functions.pubsub.topic('interval').onPublish(async () => {
        // set game state in this tick
        console.log('run interval');
    
        const gameRef = await admin.firestore().collection('game').doc('operacexxx').get();
        const game = gameRef.data();
        const timestamp = Date.now();
        
        // update GAME
        await gameRef.update({
            radiation: getRadiationForEpoch(game.epoch),
            timestamp,
            epoch: game.epoch++,
        });
        
    
        // update USERS
        let users = [];
        await admin.firestore().collection('users').get().then((querySnapshot) => {
            return querySnapshot.forEach((doc) => {
                const userRef = admin.firestore().collection('users').doc(doc.id);
                users.push({
                    ...doc.data(),
                    id: doc.id,
                })
                const currentUserRadiation = doc.data().status.radiation;
                // only 5% of regular radiation affects player in protectiveSuite;
                const DOSE_MODIFIER = doc.data().status.protectiveSuiteOn ? 0.05 : 1;
                return userRef.update({
                    'status.radiation': currentUserRadiation + ((currentRadiation / 60 ) * DOSE_MODIFIER)
                });
            });
        }).catch((err) => console.error(err));
    
        // updated BUNKERS
    
        return admin.firestore().collection('bunkers').get().then((querySnapshot) => {
            return querySnapshot.forEach((doc) => {
                const bunkerRef = admin.firestore().collection('bunkers').doc(doc.id);
    
                const bunker = {
                    ...doc.data(),
                    id: doc.id,
                };
                console.log(users, 'users');
                const numberOfUsers = users.filter(u => u.BunkerId === doc.id).length;
                console.log('numberOfUsers', numberOfUsers);
                if (typeof numberOfUsers !== 'number' || isNaN(numberOfUsers)) {
                    console.error('number of users not defined in bunker, this looks like error')
                    return;
                }
                // nothing needs to change
                if ((numberOfUsers === 0 && bunker.oxygenGeneration === 0) || bunker.isDestroyed) {
                    return;
                }
    
                let updatedOxygen = bunker.oxygen - (numberOfUsers * 1) + bunker.oxygenGeneration;
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


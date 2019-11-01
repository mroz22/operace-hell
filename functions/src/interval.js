const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { getRadiationForEpoch } = require('./utils');

const { mutations } = require('./data/mutations')

exports.runInterval = functions.pubsub.topic('interval').onPublish(async () => {
        // set game state in this tick
        const db = admin.firestore();
        const gameRef = db.collection('game').doc('operacexxx');
        const game = await gameRef.get().then((doc) => {
            return doc.data();
        });
        
        console.log(`======evaulate epoch ${game.epoch} ======`);

        if (game.epoch === 0) {
            console.log('epoch is 0, restarting game data');
            await db.collection('users').get().then((querySnapshot) => {
                return querySnapshot.forEach((doc) => {
                    const userRef = db.collection('users').doc(doc.id);
                    return userRef.update({
                        'BunkerId': '',
                        'status.radiation': 0,
                        'status.protectiveSuiteOn': false,
                    });
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

            return gameRef.update({
                epoch: 1,
                endEpoch: 840,
            });
        }

        // update GAME
        await gameRef.update({
            radiation: getRadiationForEpoch(game.epoch),
            epoch: game.epoch + 1,
        });
    
        // === LOAD DATA SECTION ===
        let users = [];
        let bunkers = [];
        await Promise.all([
            db.collection('users').get().then((querySnapshot) => {
                return querySnapshot.forEach((doc) => {
                    users.push({
                        ...doc.data(),
                        id: doc.id,
                    });
                });
            }).catch((err) => console.error(err)),
            
            db.collection('bunkers').get().then((querySnapshot) => {
                return querySnapshot.forEach((doc) => {
                    bunkers.push({
                        ...doc.data(),
                        id: doc.id,
                    });
                });
            }).catch((err) => console.error(err))
        ])
        
        console.log('data loaded');

        /* === UPDATE DATA SECTION === */

        db.collection('users').get().then((querySnapshot) => {
            return querySnapshot.forEach((doc) => {
                const userRef = db.collection('users').doc(doc.id);
                const currentUserRadiation = doc.data().status.radiation;
                
                if (!doc.data().BunkerId || (doc.data().BunkerId && !bunkers.find(b => b.id === doc.data().BunkerId).isDestroyed)) {
                    // only 5% of regular radiation affects player in protectiveSuite;
                    doseModifier = doc.data().status.protectiveSuiteOn ? 0.05 : 1;
                    return userRef.update({
                        'status.radiation': currentUserRadiation + ((game.radiation / 60 ) * doseModifier)
                    });
                }
            });
        }).catch((err) => console.error(err)),
    
        db.collection('bunkers').get().then((querySnapshot) => {
            return querySnapshot.forEach((doc) => {
                const bunkerRef = db.collection('bunkers').doc(doc.id);
                const numberOfUsers = users.filter(u => u.BunkerId === doc.id).length;
                console.log('numberOfUsers', numberOfUsers);
                if (typeof numberOfUsers !== 'number' || isNaN(numberOfUsers)) {
                    console.error('number of users not defined in bunker, this looks like error')
                    return;
                }
                // nothing needs to change
                if ((numberOfUsers === 0 && doc.data().oxygenGeneration === 0) || doc.data().isDestroyed) {
                    return;
                }
    
                let updatedOxygen = doc.data().oxygen - (numberOfUsers * 1) + doc.data().oxygenGeneration;
                if (updatedOxygen < 0) {
                    bunkerRef.update({
                        isDestroyed: true,
                    });
                } else if (updatedOxygen > doc.data().oxygenCap) {
                    updatedOxygen = doc.data().oxygenCap;
                }
                bunkerRef.update({
                    'oxygen': updatedOxygen,
                });
            });
        }).catch((err) => console.error(err));
    });


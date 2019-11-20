const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { getRadiationForEpochAdvanced, getNextMutation } = require('./utils');
const { resetGameFn } = require('./resetGame');

exports.runInterval = functions.pubsub.topic('interval').onPublish(async () => {
        // set game state in this tick
        const db = admin.firestore();
        const gameRef = db.collection('game').doc('operacexxx');
        const game = await gameRef.get().then((doc) => {
            return doc.data();
        });

        if (game.isPaused) {
            console.log(`game paused, skipping interval evaluation`);
            return;
        }
        
        console.log(`======evaulate epoch ${game.epoch} ======`);

        if (game.epoch >= game.END_EPOCH && game.isBeta) {
            console.log('game is beta, reached final epoch, restarting');
            await resetGameFn({ type: 'beta' });
            console.log('reset finished');
            return;
        }
        
        // update GAME
        await gameRef.update({
            radiation: getRadiationForEpochAdvanced(game),
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
                
                console.log('bunkers grrr', bunkers);
                if (!doc.data().BunkerId || (doc.data().BunkerId && !bunkers.find(b => b.id === doc.data().BunkerId).isDestroyed)){
                    // only 5% of regular radiation affects player in protectiveSuite;
                    doseModifier = doc.data().status.protectiveSuiteOn ? 0.05 : 1;
                    const nextRadiation = currentUserRadiation + ((game.radiation / 60 ) * doseModifier);
                    const next = {
                        'status.radiation': nextRadiation,
                    }
                    const nextMutation = getNextMutation(game, doc.data());
                    if (nextMutation) {
                        next['status.mutations'] =  [...doc.data().status.mutations, nextMutation ] 
                    }
                    return userRef.update(next);
                }
            });
        }).catch((err) => console.error(err)),
    
        db.collection('bunkers').get().then((querySnapshot) => {
            return querySnapshot.forEach((doc) => {
                const bunkerRef = db.collection('bunkers').doc(doc.id);
                const numberOfUsers = users.filter(u => u.status && u.status.BunkerId === doc.id).length;
                console.log('numberOfUsers', numberOfUsers);
                if (typeof numberOfUsers !== 'number' || isNaN(numberOfUsers)) {
                    console.error('number of users not defined in bunker, this looks like error')
                    return;
                }
                // nothing needs to change
                if ((numberOfUsers === 0 && doc.data().oxygenGeneration === 0) || doc.data().isDestroyed) {
                    return;
                }
                
                let updatedOxygen;
                
                if(game.radiation > 0) {
                    // only if radiation > 0, oxygen is depleted.
                    updatedOxygen = doc.data().oxygen - (numberOfUsers * 1) + doc.data().oxygenGeneration;
                } else {
                    updatedOxygen = doc.data().oxygen + doc.data().oxygenGeneration;
                }
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


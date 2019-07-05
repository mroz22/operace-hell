const functions = require('firebase-functions');
const admin = require('firebase-admin');
const utils = require('./utils');

exports.runInterval = functions.pubsub.topic('interval').onPublish(async () => {
        // set game state in this tick
        console.log('run interval');
    
        const game = await admin.firestore().collection('game').doc('operacexxx').get();
        
        const currentRadiation = game.data().radiation;
        const currentRadiationChangeRate = game.data().radiationChangeRate;
        const ticksToRadiationChange = game.data().ticksToRadiationChange;
    
        // updated GAME
    
        if (ticksToRadiationChange === 0) {
            const nextRadiationChangeRate = utils.getRadiationRateChange(1, 0.5);
            await admin.firestore().collection('game').doc('operacexxx').update({
                ticksToRadiationChange: utils.getRandomInt(3, 6),
                radiationChangeRate: nextRadiationChangeRate,
            });    
        } else {
            let nextRadiation = currentRadiation + currentRadiationChangeRate;
            if (nextRadiation < 0) {
                nextRadiation = 0;
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


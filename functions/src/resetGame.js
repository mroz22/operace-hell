const admin = require('firebase-admin');
const { beta, production } = require('./config');

exports.resetGameFn = async (data, context) => {
    console.log('restarting game data');
    const db = admin.firestore();
    
    // only meee
    // if (context.auth.uid !== '3u4h1Fl5zzbiD3Fc2KahEEvKVx82') {
    //     return 'nemas pravo'
    // }

    if (!data.type || (data.type !== 'beta' && data.type !== 'production')) {
        return 'you must specify either "production" or "beta" in params';
    }
    const config = data.type === 'production' ? production : beta;
    
    console.log('type of game', data.type);
    
    console.log(config);

    await db.collection('users').get().then((querySnapshot) => {
        return querySnapshot.forEach((doc) => {
            const userRef = db.collection('users').doc(doc.id);
            return userRef.update({ status: config.initialUserStatus});
        });
    }).catch((err) => console.error(err));

    const bunkersRef = db.collection('bunkers')
    config.initialBunkers.forEach(bunker => {
        bunkersRef.doc(bunker.id).set(bunker);
    })

    // await db.collection('bunkers').get().then((querySnapshot) => {
    //     return querySnapshot.forEach((doc) => {
    //         const bunkerRef = db.collection('bunkers').doc(doc.id);
    //         return bunkerRef.update({
    //             'isDestroyed': false,
    //             'oxygen': doc.data().oxygenCap,
    //         });
    //     });
    // }).catch((err) => console.error(err));

    const gameRef = db.collection('game').doc('operacexxx');
    await gameRef.update(config.initialGame);
    
    return 'hra resetovana';
}


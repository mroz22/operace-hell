const functions = require('firebase-functions');
const admin = require('firebase-admin');

const FIND_GEIGER = 'find-geiger';
const FIND_METEO = 'find-meteo';
const FIND_DOZIMETR = 'find-dozimetr';

exports.resolveGameSituation = functions.https.onCall(async (data, context) => {
        // Authentication / user information is automatically added to the request.
        const uid = context.auth.uid;
    
        const userRef = await admin.firestore().collection('users').doc(uid);
        const user = await userRef.get();
        console.log('data', data);
        switch(data.type) {
            case FIND_GEIGER:
                return findGeiger(data, context, userRef);
            case FIND_METEO:
                return findMeteo(data, context, userRef);    
            case FIND_DOZIMETR:
                return findDozimeter(data, context, userRef);
            default: 
                return "Tato herni situace neni nadefinovana."   
        }
});

const findGeiger = async (context, data, userRef) => {
    try {
        await userRef.update({ 'status.hasGeiger': true });
        return "Prozkoumal jsi toto misto a nasel Geigeruv pocitac. Od ted budes ve sve osobni aplikaci moct videt aktualni uroven radiace"
    } catch (err) {
        return `Ups, neco se pokazilo ${err.message}`;
    }
}

const findMeteo = async (context, data, userRef) => {
    try {
        await userRef.update({ 'status.hasMeteo': true });
        return "Prozkoumal jsi toto misto a nasel prirucni meteo stanici. Od ted budes ve sve osobni aplikaci moct videt smer vetru a odhadovat budouci vyvoj radiace"
    } catch (err) {
        return `Ups, neco se pokazilo ${err.message}`;
    }
}

const findDozimeter = async (context, data, userRef) => {
    try {
        await userRef.update({ 'status.hasDozimetr': true });
        return "Prozkoumal jsi toto misto a nasel prirucni dozimetr. Od ted budes ve sve osobni aplikaci moct videt jake kumulovane ozareni jsi obdrzel"
    } catch (err) {
        return `Ups, neco se pokazilo ${err.message}`;
    }
}

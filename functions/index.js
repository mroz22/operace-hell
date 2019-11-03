// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const intervals = require('./src/interval');
const situations = require('./src/gameSituation');
const { getRandomInt, getRandomUniqueFromArray } = require('./src/utils');

admin.initializeApp();

const db = admin.firestore();

exports.addUserRole = functions.auth.user().onCreate(async (user) => {
    const snapshot = await admin.firestore().collection("users").doc(user.uid).set({
        name: "Unknown soldier",
        status: {
            health: 100,
            radiation: 0,         
        },
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
    
});

exports.resetGame = functions.https.onCall(async (data, context) => {
    console.log('restarting game data');
    if (context.auth.uid !== '3u4h1Fl5zzbiD3Fc2KahEEvKVx82') {
        return 'nemas pravo'
    }
        
    const initialStatus = {
        BunkerId: '',
        radiation: 0,
        protectiveSuiteOn: false,
        enteredCorrectPassword: false,
        hasEnteredSecretChamber: false,
        mutations: [],
        injury: 'none',
        permanentInjuries: [],
    };

    const initalGame = {
        epoch: 0,
        radiation: 0,
        END_EPOCH: 840,
        MAX_SURVIVORS: 8,
        RADIATION_PER_MUTATION: 10,
        RADIATION: {
            0: 10,
            30: 30,
            50: 80,
        },
        MUTATIONS: [{
            "id": "vada-reci",
            "name": "vada reci",
            "description": "Zmutovalo ti hlasove ustroji. Od teto chvile mluvis divne. A to tim zpusobem ze za kazdou slabiku vlozis druhou slabiku obsahujici stejnou samohlasku predchazejici hlaskou 'P'. Napriklad veta 'dosla mi munice' bude od nyni 'do-po-sla-pa mi-pi mu-pu-ni-pi-ce-pe"
        }, {
            "id": "regenerace",
            "name": "regenerace",
            "description": ""
        }, {
            "id": "agresivita-na-cislovky",
            "name": "agresivita na cislovky", 
            "description": "Prestavas se kontrolovat a reagujes vztekle na obycejne veci. Pokud nekdo vyslovi libovolnou cislovku, rozcilis se a zacnes ho mlatit."
        }, {
            "id": "agresivita-zadost" ,
            "name": "agresivita na prosbu",
            "description": "kdykoliv te nekdo o neco poprosi, vytocis se do bela a zacnes ho mlatit."
        }, {
            "id": "opozitor",
            "name": "opozitor",
            "description": "vzdy a za kazdych okolnosti s kazdym nesouhlasis."
        }, {
            "id": "pacifista",
            "name": "opozitor",
            "description": "vzdy a za kazdych okolnosti s kazdym nesouhlasis."
        }, {
            "id": "homo-buzna",
            "name": "homo buzna",
            "description": "Nakazil ses gay mutaci. Od tedo chvile mas potrebu pervezne obtezovat osoby stejneho pohlavi"
        }, {
            "id": "gender-mutace",
            "name": "zmena genderu",
            "description": "Mutace ti zmenila gender na opacne pohlavi. Od teto chvile musis o sobe zacit mluvit v zenskem rode."
        }, {
            "id": "krvelacnost", 
            "name": "krvelacnost",
            "description": "slysis hlasy. musis nekoho zavrazdit. slysiiis, uz te volaji."
        }, {
            "id": "mysogynie", 
            "name": "mosogynie (macho)",
            "description": "odmitas komunikovat s osobami opacneho pohlavi (vcetne homobuzen a transgeneru)."
        }, {
            "id": "turret", 
            "name": "turretuv syndrom",
            "description": "turettuv syndrom spociva v tom ze beznou komunikaci prokladas nadavkama. Ale to tim zpusobem, ze nadavku vystekavas tak nejak zniceno nic a dosti nahlas."
        }],
        PERMANENT_INJURIES: [{
            "id": "slepota-leve",
            "name": "slepota leveho oka",
            "description": "Pod sklicko brylo leveho oka si pripevni gazu (lepici paska)"
        }, {
            "id": "slepota-prave",
            "name": "slepota praveho oka",
            "description": "Pod sklicko brylo praveho oka si pripevni gazu (lepici paska)"
        }, {
            "id": "amputace-horni-leva",
            "name": "amputace leve ruky",
            "description": "Ruku si vytahnes z rukavu a strcis dovnitr k telu. Nebudesj i dale pouzivat."
        }, {
            "id": "amputace-horni-prava",
            "name": "amputace prave ruky",
            "description": "Ruku si vytahnes z rukavu a strcis dovnitr k telu. Nebudesj i dale pouzivat."
        }, {
            "id": "ustrelene-prsty-horni-leva",
            "name": "ustrelene prsty horni leve ruky",
            "description": "Zafixuji se (ukzovacek az malicek) elektrikarskou paskou."
        }, {
            "id": "ustrelene-prsty-horni-prava",
            "name": "ustrelene prsty horni prave ruky",
            "description": "Zafixuji se (ukzovacek az malicek) elektrikarskou paskou."
        }, {
            "id": "mrtvicka",
            "name": "mrtvicka",
            "description": "Spatne chodis. Svaz si nohy obvazem na vzdalenost cca 30 cm."
        }]
    }

    await db.collection('users').get().then((querySnapshot) => {
        return querySnapshot.forEach((doc) => {
            const userRef = db.collection('users').doc(doc.id);
            return userRef.update({ status: initialStatus});
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
    await gameRef.update(initalGame);
    
    return 'hra resetovana';

});


exports.runInterval = intervals.runInterval;
exports.resolveGameSituation = situations.resolveGameSituation;

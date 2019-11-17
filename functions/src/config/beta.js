const initialUserStatusBeta = {
    BunkerId: '',
    radiation: 0,
    protectiveSuiteOn: false,
    enteredCorrectPassword: false,
    hasEnteredSecretChamber: false,
    mutations: [],
    injury: 'none',
    permanentInjuries: [],
};

const initialGameBeta = {
    isBeta: true,
    epoch: 0,
    radiation: 0,
    END_EPOCH: 60,
    MAX_SURVIVORS: 8,
    RADIATION_PER_MUTATION: 10,
    MAX_SAFE_RADIATION: 100,
    RADIATION: {
        0: 10,
        30: 30,
        50: 80,
    },
    MUTATIONS: [{
        "id": "test-1",
        "name": "fakt neprijemna mutace 1",
        "description": "mutace ktera ti muze pomoct a taky te muze pekne pripozmrdit."
    },{
        "id": "test-2",
        "name": "fakt neprijemna mutace 2",
        "description": "mutace ktera ti muze pomoct a taky te muze pekne pripozmrdit."
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

module.exports = {
    initialUserStatusBeta,
    initialGameBeta,
}
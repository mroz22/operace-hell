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
    RADIATION_PER_MUTATION: 100,
    MAX_SAFE_RADIATION: 1000,
    TRAP_EPOCHS: 2,
    PASSWORD: 'foo',
    RADIATION: {
        0: 0,
        // 5: 0,
        // 10: 50,
        // 15: 250,
        // 20: 750,
        // 25: 1250,
        // 30: 300,
        // 35: 0,
        // 40: 0,
        60: 8000,
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
        "id": "amputace-horni-prava",
        "name": "amputace prave ruky",
        "description": "Ruku si vytahnes z rukavu a strcis dovnitr k telu. Nebudesj i dale pouzivat."
    }, {
        "id": "ustrelene-prsty-horni-leva",
        "name": "ustrelene prsty horni leve koncetiny",
        "description": "Zafixuji se (ukzovacek az malicek) elektrikarskou paskou."
    }, {
        "id": "ustrelene-prsty-horni-prava",
        "name": "ustrelene prsty horni prave koncetiny",
        "description": "Zafixuji se (ukzovacek az malicek) elektrikarskou paskou."
    }, {
        "id": "mrtvicka",
        "name": "mrtvicka",
        "description": "Spatne chodis. Svaz si nohy obvazem na vzdalenost cca 30 cm."
    }]
}

const initialBunkersBeta = [{
    id: 'cerveny',
    name: 'cerveny',
    isDestroyed: false,
    oxygen: 100,
    oxygenCap: 100,
    oxygenGeneration: 1,
}, {
    id: 'modry',
    name: 'modry',
    isDestroyed: false,
    oxygen: 100,
    oxygenCap: 100,
    oxygenGeneration: 1,
}, {
    id: 'zeleny',
    name: 'zeleny',
    isDestroyed: false,
    oxygen: 60,
    oxygenCap: 80,
    oxygenGeneration: 1,
}, {
    id: 'cerny',
    name: 'cerny',
    isDestroyed: false,
    oxygen: 180,
    oxygenCap: 180,
    oxygenGeneration: 1,
}, {
    id: 'zluty',
    name: 'zluty',
    isDestroyed: false,
    oxygen: 360,
    oxygenCap: 360,
    oxygenGeneration: 1,
}];

module.exports = {
    initialUserStatusBeta,
    initialGameBeta,
    initialBunkersBeta

}
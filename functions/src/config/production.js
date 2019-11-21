const initialUserStatusProduction = {
    BunkerId: '',
    radiation: 0,
    protectiveSuiteOn: false,
    enteredCorrectPassword: false,
    hasEnteredSecretChamber: false,
    mutations: [],
    injury: 'none',
    permanentInjuries: [],
};

const initialGameProduction = {
    isBeta: false,
    epoch: 0,
    radiation: 0,
    END_EPOCH: 840,
    MAX_SURVIVORS: 8,
    RADIATION_PER_MUTATION: 100,
    MAX_SAFE_RADIATION: 1000,
    TRAP_EPOCHS: 20,
    PASSWORD: 'foo',
    RADIATION: {
        0: 0,
        5: 5,
        10: 0,
        30: 0,
        40: 10,
        45: 30,
        50: 0,
        60: 0,
        90: 0,
        120: 0,
        150: 0,
        180: 0,
        210: 0,
        240: 0,
        270: 0,
        300: 0,
        330: 0,
        360: 0,
        390: 0,
        420: 0,
        450: 0,
        480: 0,
        510: 0,
        540: 0,
        600: 0,
        630: 0,
        660: 0,
        690: 0,
        720: 0,
        750: 0,
        780: 0,
        810: 0,
        840: 5000,
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
        "description": "Ruku si vytahnes z rukavu a strcis dovnitr k telu. Nebudes ji dale pouzivat."
    }, {
        "id": "prostrelene-level-koleno",
        "name": "prostrelene leve koleno",
        "description": "Nohu neohnes v koleni."
    }, {
        "id": "ustrelene-prsty-horni-leva",
        "name": "ustrelene prsty horni leve koncetiny",
        "description": "Zafixuji se (ukazovacek az malicek) elektrikarskou paskou."
    }, {
        "id": "ustrelene-prsty-horni-prava",
        "name": "ustrelene prsty horni prave koncetiny",
        "description": "Zafixuji se (ukazovacek az malicek) elektrikarskou paskou."
    }, {
        "id": "mrtvicka",
        "name": "mrtvicka",
        "description": "Spatne chodis. Svaz si nohy obvazem na vzdalenost cca 30 cm."
    }]
}

const initialBunkersProduction = [{
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
    oxygen: 100,
    oxygenCap: 100,
    oxygenGeneration: 1,
}, {
    id: 'cerny',
    name: 'cerny',
    isDestroyed: false,
    oxygen: 100,
    oxygenCap: 100,
    oxygenGeneration: 1,
}, {
    id: 'zluty',
    name: 'zluty',
    isDestroyed: false,
    oxygen: 100,
    oxygenCap: 100,
    oxygenGeneration: 1,
}, {
    id: 'bily',
    name: 'bily',
    isDestroyed: false,
    oxygen: 100,
    oxygenCap: 100,
    oxygenGeneration: 3.1,
}];

module.exports = {
    initialUserStatusProduction,
    initialGameProduction,
    initialBunkersProduction,
}
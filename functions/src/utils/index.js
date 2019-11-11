function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRadiationForEpoch = (game) => {
    const key = Object.keys(game.RADIATION).reverse().find(k => Number(k) <= game.epoch);
    return game.RADIATION[key];
};

const getRadiationForEpochAdvanced = game => {
    const fromKey = Object.keys(game.RADIATION).reverse().find(k => Number(k) <= game.epoch);
    const start  = {epoch: Number(fromKey), radiation: game.RADIATION[fromKey]};
    if (game.epoch <= fromKey) {
        return start.radiation;
    }
    const remainingChanges = Object.keys(game.RADIATION)
        .map(key => ({ epoch: Number(key), radiation: game.RADIATION[key]}))
        .filter(o => o.epoch >= game.epoch && start.radiation !== o.radiation);
    if (remainingChanges.length === 0) {
        return 0;
    }
    const end = remainingChanges[0];
    const epochDiff = end.epoch - start.epoch;
    return start.radiation + ((end.radiation - start.radiation) / epochDiff) * (game.epoch - start.epoch);
}

const getNextMutation = (game, role) => {
    if (!game.RADIATION_PER_MUTATION) {
        throw new Error('game.RADIATION_PER_MUTATION is not set');
    }
    const { mutations, radiation } = role.status;
    if (radiation <= (mutations.length * game.RADIATION_PER_MUTATION)) {
        return null;
    }
    const unusedMutations = game.MUTATIONS.filter(am => !mutations.find(m => m.name === am.name));
    if (unusedMutations.length === 0) return null;
    return unusedMutations[getRandomInt(0, unusedMutations.length -1)];
};

const getRandomUniqueFromArray = (currentArr, possibleArr) => {
    const unusedElements = possibleArr.filter(am => !currentArr.find(m => m.id === am.id));
    if (unusedElements.length === 0) return null;
    return unusedElements[getRandomInt(0, unusedElements.length -1)];
}

module.exports = {
    getRandomInt,
    getRadiationForEpoch,
    getRadiationForEpochAdvanced,
    getNextMutation,
    getRandomUniqueFromArray,
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRadiationForEpoch = (game) => {
    const key = Object.keys(game.RADIATION).reverse().find(k => Number(k) <= game.epoch);
    return game.RADIATION[key];
};

const getNextMutation = (game, role) => {
    const { mutations, radiation } = role.status;
    if (radiation < mutations.length * game.RADIATION_PER_MUTATION) {
        return null;
    }
    
    const unusedMutations = game.MUTATIONS.filter(am => !mutations.find(m => m.name === am.name));
    return unusedMutations[getRandomInt(0, unusedMutations.length -1)];
};

module.exports = {
    getRandomInt,
    getRadiationForEpoch,
    getNextMutation,
}
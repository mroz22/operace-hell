const { radiation } = require('../config/radiation');

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRadiationForEpoch = (game) => {
    const key = Object.keys(game.RADIATION).reverse().find(k => Number(k) <= game.epoch);
    return game.RADIATION[key];
};

module.exports = {
    getRandomInt,
    getRadiationForEpoch,
}
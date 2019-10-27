const { radiation } = require('../config/radiation');

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRadiationForEpoch = (epoch) => {
    const key = Object.keys(radiation).reverse().find(k => Number(k) <= epoch);
    return radiation[key];
};

module.exports = {
    getRandomInt,
    getRadiationForEpoch,
}
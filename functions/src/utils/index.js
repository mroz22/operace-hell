function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRadiationRateChange(max, growthProbability) {
    const rate = (getRandomInt(0, max) / 100)
    if (Math.random() > growthProbability) {
        rate * -1;
    }
    return rate;
}

module.exports = {
    getRandomInt,
    getRadiationRateChange,
}
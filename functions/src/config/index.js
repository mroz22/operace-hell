const { initialGameProduction, initialUserStatusProduction, initialBunkersProduction } = require('./production');
const { initialGameBeta, initialUserStatusBeta, initialBunkersBeta } = require('./beta');

module.exports = {
    production: {
        initialGame: initialGameProduction,
        initialUserStatus: initialUserStatusProduction,
        initialBunkers: initialBunkersProduction,
    }, 
    beta: {
        initialGame: initialGameBeta,
        initialUserStatus: initialUserStatusBeta,
        initialBunkers: initialBunkersBeta,
    }
}
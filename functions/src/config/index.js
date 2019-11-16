const { initialGameProduction, initialUserStatusProduction } = require('./production');
const { initialGameBeta, initialUserStatusBeta } = require('./beta');

module.exports = {
    production: {
        initialGame: initialGameProduction,
        initialUserStatus: initialUserStatusProduction,
    }, 
    beta: {
        initialGame: initialGameBeta,
        initialUserStatus: initialUserStatusBeta
    }
}
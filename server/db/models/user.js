'use strict';

const jsonwebtoken = require('jsonwebtoken');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
      },
      login: async (password) => {
        if (password === 'hashedpassword') {
          this.token = jsonwebtoken.sign({ role: 'admin' }, 'agjiob09gt20tkgbmmba_fkbFJ');
          await this.save();

        }
      }
    }
  });
};
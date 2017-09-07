'use strict';

const restApi = require('../../api/rest/index');

module.exports = (app) => {
  app.use('/api/rest', restApi)
};

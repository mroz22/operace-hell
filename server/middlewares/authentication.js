'use strict';

const jwt = require('koa-jwt');
const secret = 'agjiob09gt20tkgbmmba_fkbFJ'; // todo:  should not be hardcoded

module.exports = (app) => {
  app.use(jwt({ secret: secret }).unless({ path: [/^\/public/] }));
};



'use strict';

const KoaRouter = require('koa-router');

const api = KoaRouter({ prefix: '/api'});

require('./controllers/auth')(api);
require('./controllers/users')(api);

module.exports = api;
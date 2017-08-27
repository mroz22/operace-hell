'use strict';

const KoaRouter = require('koa-router');

const api = KoaRouter();

require('./controllers/users')(api);

module.exports = api;
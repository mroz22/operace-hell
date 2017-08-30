'use strict';
const convert = require('koa-convert'); // necessary until koa-generic-session has been updated to support koa@2
const session = require('koa-generic-session');

const passport = require('./passport');

module.exports = (app) => {
  app.keys = ['secret'];

  app.use(convert(session()));
  app.use(passport.initialize());
  app.use(passport.session());
};
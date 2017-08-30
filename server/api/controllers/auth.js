"use strict";

const User = require('../../db/models').User;

const passport = require('../../config/passport');

let app = require('../../index');

module.exports = (api) => {

  // api.get('/auth', async(ctx, next) => {
  //   await ctx.render('auth')
  // });

  api.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect : '/',
    failureRedirect : '/auth'
  }), function(ctx, next) {
    console.log('hello');
    next();
  });

  api.get('/auth/facebook', passport.authenticate('facebook', {
    scope: [
      'public_profile',
      'email',
    ],
  }));

};
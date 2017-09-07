"use strict";

const User = require('../db/models').User;
const passport = require('passport');
const connectEnsureLogIn = require('connect-ensure-login');

module.exports = (api) => {

  api.get('/login', function(req, res){
    res.render('login');
  });

  api.get('/login/facebook', passport.authenticate('facebook'));

  api.get('/login/facebook/return', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
    res.redirect('/profile');
  });

  api.get('/profile', connectEnsureLogIn.ensureLoggedIn('/login'), function(req, res){
    res.render('profile', { user: req.user });
  });

};
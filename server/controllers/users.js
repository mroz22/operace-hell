"use strict";

const User = require('../db/models').User;
const connectEnsureLogIn = require('connect-ensure-login');

module.exports = (router) => {

  router.get('/users', /*connectEnsureLogIn.ensureLoggedIn('/login'), */ async(req, res) => {
    let users = await User.findAll({raw: true});
    res.send(users);
  });

  router.get('/users/:id',  /*connectEnsureLogIn.ensureLoggedIn('/login'), */ async(req, res) => {
    let user = await User.findOne({
      where: {
        id: req.params.id
      }
    });
    res.send(user.get({
      plain: true
    }));
  });

  router.post('/users', /*connectEnsureLogIn.ensureLoggedIn('/login'), */ async(req, res) => {
    let user = User.build(req.body);
    await user.save();
    res.send(user);
  });

  router.put('/users/:id', async(req, res) => {
    let user;
    try {
      user = await User.findOne({where:  { id: req.params.id }});
    } catch(err) {
      console.log(err);
    }
    try {
      await user.update(req.body)
    } catch(err) {
      console.log(err);
    }
    res.send(user.get({
      plain: true
    }));
  });

  router.delete('/users/:id', async(req, res) => {
    let numberDeleted;
    try {
      numberDeleted = await User.destroy({where: {
        id: req.params.id
      }});
    } catch(err) {
      console.log(err);
    }
    res.send({numberDeleted});
  });

};
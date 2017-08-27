"use strict";

const User = require('../../db/models').User;

module.exports = (api) => {

  api.get('/users', async(ctx, next) => {
    ctx.body = await User.findAll({raw: true});
    next();
  });

  api.get('/users/:id', async(ctx, next) => {
    ctx.body = await User.findAll({
      where: {
        id: ctx.params.id
      }
    });
    next();
  });

  api.post('/users', async(ctx, next) => {
    let user = User.build(ctx.request.body);
    await user.save();
    ctx.body = user;
    next();
  });



};
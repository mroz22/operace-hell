'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const koaRes = require('koa-res');
const convert = require('koa-convert');
const api = require('./api/api');
let app = new Koa();

app.use(serve(__dirname + '/web/build'));

require('./config/plugin-passport')(app);

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
});

app.use(bodyParser());
app.use(convert(koaRes()));

// logger
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.status} ${ctx.method} ${ctx.url} - ${ms}ms`);
});

app.use(api.routes());
app.use(api.allowedMethods());

app.listen(3001);


module.exports = app;
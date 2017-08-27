'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const api = require('./api/api');

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

// logger

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.status} ${ctx.method} ${ctx.url} - ${ms}ms`);
});

app.use(api.routes());
app.use(api.allowedMethods());

app.listen(3000);
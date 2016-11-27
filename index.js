/**
 * index.js
 *
 * @author: Chris Young (young.c.5690@gmail.com)
 * @created: November 19th 2016
 */

'use strict'

const fs = require('fs');
const Koa = require('koa');
const path = require('path');

const app = new Koa();

app.use(async (ctx, next) => await next() || console.log(`${ctx.method} ${ctx.url}`));

app.use(async (ctx) => {
  if (ctx.method !== 'GET')
    return ctx.status = 405;

  if (ctx.url === '/')
    ctx.url = '/index.html';

  ctx.type = path.extname(ctx.url);
  ctx.body = fs.createReadStream(`${__dirname}/public${ctx.url}`);
});

app.listen(8421);


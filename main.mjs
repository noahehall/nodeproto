'use strict';


import Koa from 'koa';

const app = new Koa();


const appPort = 3000;
app.use(async ctx => {
  ctx.body = 'Hello Wurl';
});

app.listen(appPort)

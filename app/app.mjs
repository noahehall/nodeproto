'use strict';


import Koa from 'koa';
import initMiddleware from './api/middleware/initMiddleware.mjs';

const app = new Koa();
const appPort = 3000;


initMiddleware(app);

app.use(async ctx => {
  ctx.body = 'Hello Wurl';
});



export default function App() {
  console.info('app started')
  app.listen(appPort);
}

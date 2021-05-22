'use strict';


import Koa from 'koa';
import initMiddleware from './api/middleware/initMiddleware.mjs';
import { getEnv } from './api/shared.mjs';


const app = new Koa();
const appPort = getEnv('appPort');

app.env = getEnv('NODE_ENV');

initMiddleware(app);

app.use(async ctx => {
  ctx.body = 'Hello Wurl';
});



export default function App() {
  console.info('app started')
  app.listen(appPort);
}

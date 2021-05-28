'use strict';

import http from 'http';
import initMiddleware from './api/middleware/initMiddleware.mjs';
import createApp from './appCreate.mjs';
import initAppRouter from './appRouter.mjs';


const app = initAppRouter(initMiddleware(createApp()));

export default async function asyncApp() {
  return http.createServer((await app).callback());
}

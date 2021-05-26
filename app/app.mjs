'use strict';

import http from 'http';
import initMiddleware from './api/middleware/initMiddleware.mjs';
import createApp from './appCreate.mjs';
import initAppRouter from './appRouter.mjs';


const app = createApp();

initMiddleware(app);
initAppRouter(app);

export default function App() {
  return http.createServer(app.callback());
}

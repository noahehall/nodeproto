'use strict';

import http from 'http';
import initMiddleware from './api/middleware/initMiddleware.mjs';
import createApp from './appCreate.mjs';


const app = createApp();

initMiddleware(app);

export default function App() {
  console.info('app started')
  // app.listen(getEnv('appPort'));
  http.createServer(app.callback()).listen(app.context.appPort);
}

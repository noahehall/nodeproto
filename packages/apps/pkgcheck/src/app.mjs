// @flow strict

import createApp from './appCreate.mjs';
import initAppRouter from './appRouter.mjs';
import initMiddleware from './api/middleware/initMiddleware.mjs';

export const App = initAppRouter(initMiddleware(createApp()));
export default App;

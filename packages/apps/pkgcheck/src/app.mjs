// @flow

import { createApp } from './appCreate';
import { initAppRouter } from './appRouter';
import { initMiddleware } from './api/middleware/initMiddleware';

export const App = initAppRouter(initMiddleware(createApp()));

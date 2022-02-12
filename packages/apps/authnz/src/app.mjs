// @flow

import { createApp } from './appCreate';
import { initAppRouter } from './appRouter';
import { initMiddleware } from './api/middleware/initMiddleware';

import type { AppType } from './libdefs';

export const App: AppType = initAppRouter(initMiddleware(createApp()));

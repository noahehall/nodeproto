// @flow

/**
 * sets up all routes for the application
 * maps paths to controllers or path handlers
 */
import Router from 'koa-tree-router';

import { v1Controller } from './api/routes/v1/controller';

import type { AppType } from './libdefs';

const router = new Router();
const v1RouterGroup = router.newGroup('/v1');

export const initAppRouter = async (asyncApp: AppType): AppType => {
  // add healthcheck app
  // @see https://github.com/vulcaryn/koa-healthcheck/blob/master/index.js
  // router.get(/healthcheck, healthcheckHandler);

  return asyncApp.then((app) => {
    // init router groups
    v1Controller(v1RouterGroup, app);

    app.use(router.routes());

    return asyncApp;
  });
};

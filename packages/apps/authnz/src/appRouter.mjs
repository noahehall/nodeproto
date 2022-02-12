// @flow

/**
 * sets up all routes for the application
 * maps paths to controllers or path handlers
 */
import Router from 'koa-tree-router';

import { v1Controller } from './api/routes/v1/controller';

const router = new Router();
const v1RouterGroup = router.newGroup('/v1');

export const initAppRouter = async (asyncApp) => {
  // map home to our SPA
  // TODO: see fossissues.md/koa-tree-router
  // + spa moved to packages/client and this route is deleted
  // + keeping as a reminder for the fossisuess thing
  // router.get('/', spaHandler);

  return asyncApp.then((app) => {
    // init router groups
    v1Controller(v1RouterGroup, app);

    app.use(router.routes());

    return asyncApp;
  });
};

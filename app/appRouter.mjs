'use strict';

/**
 * sets up all routes for the application
 * maps paths to controllers or path handlers
 */
import Router from 'koa-tree-router';
import spaHandler from './api/routes/spa/handler.mjs';
import v1Controller from './api/routes/v1/controller.mjs';


const router = new Router();
const v1RouterGroup = router.newGroup('/v1');


export default async function initAppRouter (asyncApp) {
  // map home to our SPA
  // TODO: see fossissues.md/koa-tree-router
  router.get('/', spaHandler);


  return asyncApp.then(app => {
    // init router groups
    v1Controller(v1RouterGroup, app);

    app.use(router.routes());

    return asyncApp;
  });
}

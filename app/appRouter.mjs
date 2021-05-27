'use strict';

import Router from 'koa-tree-router';
import spaHandler from './api/routes/spa/handler.mjs';
import v1Controller from './api/routes/v1/controller.mjs';


const router = new Router();
const v1RouterGroup = router.newGroup('/v1');


export default function initAppRouter (app) {
  // map home to our SPA
  // TODO: see fossissues.md/koa-tree-router
  router.get('/', spaHandler);

  // init router groups
  v1Controller(v1RouterGroup);

  app.use(router.routes());

  return app;
}

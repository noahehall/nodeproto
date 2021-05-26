'use strict';

import Router from 'koa-tree-router';
import landingPageRouter from './api/routes/landingPage/handler.mjs';
import v1Controller from './api/routes/v1/controller.mjs';


const router = new Router();
const v1RouterGroup = router.newGroup('/v1');


export default function initAppRouter (app) {

  // map home to our SPA
  router.get('/', landingPageRouter);
  // TODO(noah):map everything not caught to landingPageRouter

  // init router groups
  v1Controller(v1RouterGroup);

  app.use(router.routes());
}

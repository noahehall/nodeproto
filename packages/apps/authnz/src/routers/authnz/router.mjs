// @flow

import Router from 'koa-tree-router';

import * as v1 from './v1';

import type { KoaAppType } from '../../libdefs';

// @see https://github.com/steambap/koa-tree-router#nested-routes
const authnzRouter = new Router();

authnzRouter.get('/', (ctx) => {
  ctx.body = 'yolo wurl';
});

export const useRouter = async (app: KoaAppType): Promise<KoaAppType> => {
  // TODO: each controller should come with a distinct healthcheck endpoint
  // @see https://github.com/vulcaryn/koa-healthcheck/blob/master/index.js
  // router.get(/healthcheck, healthcheckHandler);

  await v1.controller(authnzRouter, app);

  app.use(authnzRouter.routes());

  return app;
};

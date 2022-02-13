// @flow

import Router from 'koa-tree-router';

import * as v1 from './v1';

import type { KoaAppType } from '../libdefs';

// @see https://github.com/steambap/koa-tree-router#nested-routes
const authnzRouter = new Router();

export const useRouter = async (app: KoaAppType): Promise<KoaAppType> => {
  // TODO: each controller should come with a distinct healthcheck endpoint
  // @see https://github.com/vulcaryn/koa-healthcheck/blob/master/index.js
  // router.get(/healthcheck, healthcheckHandler);

  v1.controller(authnzRouter, app);
  // v2.controller(authnzRouter, app);
  // etc

  app.use(authnzRouter.routes());

  return app;
};

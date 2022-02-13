// @flow

import { logIt } from '@nodeproto/shared';

import Koa from 'koa';
import koaQs from 'koa-qs'; // @see https://github.com/koajs/qs#whats-different

import * as authnzRouter from './authnzRouter';

import { APP_CONFIG, KOA_CONFIG } from './constants';
import { initMiddleware } from './middleware';

import type { AppType, KoaAppType, ObjectType } from './libdefs';

export const createApp = async (opts: ObjectType = {}): Promise<KoaAppType> => {
  // $FlowFixMe[extra-arg]
  const app = koaQs(new Koa(Object.assign({}, KOA_CONFIG, opts), 'strict'));

  app.context.config = APP_CONFIG;

  app.on('error', (err) => logIt('app error', err));

  await initMiddleware(app);

  await authnzRouter.useRouter(app);

  return app;
};

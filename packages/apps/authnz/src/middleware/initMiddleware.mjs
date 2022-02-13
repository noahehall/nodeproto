// @flow

import compose from 'koa-compose';

import { eTag } from './eTag';
import { koaBodyParser } from './koaBody';
import { koaCharset } from './koaCharset';
import { koaCors } from './koaCors';
import { koaCsrf } from './koaCsrf';
import { koaHelmet } from './koaHelmet';
import { koaRateLimit } from './koaRateLimit';
import { koaSession } from './koaSession';
import { logger } from './logger';
import { responseTime } from './responseTime';

import type { AppType, KoaAppType } from '../libdefs';

export const initMiddleware = async (asyncApp: KoaAppType): AppType => {
  const app = await asyncApp;

  app.use(compose([
    logger(undefined, app),
    responseTime(undefined, app),
    koaSession(undefined, app),
    koaHelmet(),
    koaCors(),
    koaCsrf(undefined, app),
    koaRateLimit(undefined, app),
    eTag(undefined, app),
    koaBodyParser(undefined, app)
    // koaCharset(), // todo
  ]));

  return asyncApp;
};

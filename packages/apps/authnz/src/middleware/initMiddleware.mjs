// @flow

import { logIt } from '@nodeproto/shared';

import compose from 'koa-compose';

import { eTag } from './eTag';
import { koaBody, koaBodyParser } from './koaBody';
import { koaCharset } from './koaCharset';
import { koaCors } from './koaCors';
import { koaCsrf } from './koaCsrf';
import { koaHelmet } from './koaHelmet';
import { koaRateLimit } from './koaRateLimit';
import { koaSession } from './koaSession';
import { logger } from './logger';
import { responseTime } from './responseTime';

import type { KoaAppType } from '../libdefs';

export const initMiddleware = (app: KoaAppType): KoaAppType => {
  const middlewareStack = compose([
    logger(app),
    responseTime(app),
    koaRateLimit(app),
    // koaSession(app), // internal server error
    koaCharset(app),
    koaHelmet(app), // need to update CSP config
    koaCors(app),
    koaCsrf(app),
    eTag(app),
    koaBody(app),
  ]);

  app.use(middlewareStack);

  return app;
};

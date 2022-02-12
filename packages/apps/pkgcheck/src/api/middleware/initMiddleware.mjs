// @flow

import { eTag } from './eTag';
import { koaBodyParser } from './koaBody';
import { koaCharset } from './koaCharset';
import { koaCors } from './koaCors';
import { koaCsrf } from './koaCsrf';
import { koaHelmet } from './koaHelmet';
import { koaRatelimit } from './koaRatelimit';
import { koaSession } from './koaSession';
import { logger } from './logger';
import { responseTime } from './responseTime';

export const initMiddleware = async (asyncApp) => {
  return asyncApp.then((app) => {
    // always
    app.use(
      logger(),
      responseTime(),
      koaSession(undefined, app),
      koaHelmet(),
      koaCors(),
      koaCsrf(undefined, app),
      koaRatelimit(),
      eTag(),
      koaBodyParser()
      // koaCharset(), // todo
    );

    return asyncApp;
  });
};

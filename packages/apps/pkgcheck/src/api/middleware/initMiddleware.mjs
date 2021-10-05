// @flow strict

import { koaBodyParser } from './koaBody.mjs';

import eTag from './eTag.mjs';
import koaCharset from './koaCharset.mjs';
import koaCors from './koaCors.mjs';
import koaCsrf from './koaCsrf.mjs';
import koaHelmet from './koaHelmet.mjs';
import koaRatelimit from './koaRatelimit.mjs';
import koaSession from './koaSession.mjs';
import logger from './logger.mjs';
import responseTime from './responseTime.mjs';

export default async function initMiddleware (asyncApp) {
  return asyncApp.then(app => {
    // always
    app.use(
      logger(),
      responseTime(),
      koaSession(
        undefined,
        app
      ),
      koaHelmet(),
      koaCors(),
      koaCsrf(
        undefined,
        app
      ),
      koaRatelimit(),
      eTag(),
      koaBodyParser(),
      // koaCharset(), // todo
    );

    return asyncApp;
  });
}

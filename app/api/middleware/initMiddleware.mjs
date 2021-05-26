'use strict';

import logger from './logger.mjs';
import responseTime from './responseTime.mjs';
import koaBody from './koaBody.mjs';
import koaSession from './koaSession.mjs';
import eTag from './eTag.mjs';
import appBody from './appBody.mjs';
import koaHelmet from './koaHelmet.mjs';
import compose from 'koa-compose';
import koaCsrf from './koaCsrf.mjs';
import koaCors from './koaCors.mjs';
import koaRatelimit from './koaRatelimit.mjs';
import koaCharset from './koaCharset.mjs';

export default function initMiddleware (app) {
  app.use(compose([logger(), responseTime()]));

  app.use(koaRatelimit());
  app.use(koaHelmet());
  app.use(koaCors());
  app.use(koaSession(undefined, app));
  app.use(koaBody());
  app.use(koaCsrf(undefined, app));
  app.use(eTag());
  // app.use(appBody(app));
  app.use(koaCharset());
}

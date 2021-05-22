'use strict';

import logger from './logger.mjs';
import responseTime from './responseTime.mjs';
import koaBody from './koaBody.mjs';
import koaSession from './koaSession.mjs';
import eTag from './eTag.mjs';
import appBody from './appBody.mjs';
import koaHelmet from './koaHelmet.mjs';



export default function initMiddleware (app) {
  app.use(logger());
  app.use(responseTime()); // keep this as early as possible
  app.use(koaHelmet());
  app.use(eTag());
  app.use(koaSession(undefined, app)); // must be last if !!autoCommit
  app.use(appBody(app));
  app.use(koaBody());
}

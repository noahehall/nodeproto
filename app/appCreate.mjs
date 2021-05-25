'use strict';

import Koa from 'koa';
import { getEnv } from './api/shared.mjs';
import koaQs from 'koa-qs';

export default (overrides = {}) => {

  // default app settings
  const defaults = {
    env: getEnv('NODE_ENV'),
    // https://github.com/koajs/session#example
    keys: ['some secret hurr'],
  };

  const app = Object.assign(new Koa(), defaults, overrides);

  // setup context
  // todo(noah) move to sep fn
  app.context.appPort = getEnv('appPort');

  // @see https://github.com/koajs/qs#whats-different
  return koaQs(app, 'strict');
}

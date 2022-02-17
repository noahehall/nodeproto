// @flow

// @see https://github.com/venables/koa-helmet#usage // stale as f
// @see https://helmetjs.github.io/

import compose from 'koa-compose';

import { helmet } from './koaHelmetCopypasta';

import type { MiddlewareFactoryType } from '../libdefs';

export const koaHelmet: MiddlewareFactoryType = (app) => {
  // TODO: see the type def for the ones ive updated
  return compose([
    helmet.hidePoweredBy(app)
  ]);
};

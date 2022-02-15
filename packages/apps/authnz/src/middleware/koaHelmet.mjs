// @flow

// @see https://github.com/venables/koa-helmet#usage
// @see https://helmetjs.github.io/

import compose from 'koa-compose';
import helmet from 'koa-helmet';

import type { MiddlewareFactoryType } from '../libdefs';

export const koaHelmet: MiddlewareFactoryType = (app) => {
  // todo;
};
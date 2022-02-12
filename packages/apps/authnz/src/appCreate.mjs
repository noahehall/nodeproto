// @flow

import Koa from 'koa';
import koaQs from 'koa-qs';

import { getEnv } from './api/shared';

// default app settings
const defaults = {
  // https://github.com/koajs/session#example
  keys: ['some secret hurr'],
};

export const createApp = async (overrides = {}) => {
  const app = Object.assign(new Koa(), defaults, overrides);

  // @see https://github.com/koajs/qs#whats-different
  return koaQs(app, 'strict');
};

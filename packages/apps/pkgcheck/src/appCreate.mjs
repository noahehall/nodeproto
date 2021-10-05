// @flow strict

import { getEnv } from './api/shared.mjs';
import Koa from 'koa';
import koaQs from 'koa-qs';

// default app settings
const defaults = {
  // https://github.com/koajs/session#example
  keys: ['some secret hurr'],
};

export default async function createApp (overrides = {}) {
  const app = Object.assign(
    new Koa(),
    defaults,
    overrides
  );

  // @see https://github.com/koajs/qs#whats-different
  return koaQs(
    app,
    'strict'
  );
}

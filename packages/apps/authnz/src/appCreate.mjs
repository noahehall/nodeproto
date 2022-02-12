// @flow

import Koa from 'koa';
import koaQs from 'koa-qs';

import { getEnv } from './api/shared';

import type { AppType, ObjectType } from './libdefs';

// default app settings
const defaults: { keys: string[]} = {
  // https://github.com/koajs/session#example
  keys: ['some secret hurr'],
};

export const createApp = async (overrides: ObjectType = {}): AppType => {
  const app = Object.assign(new Koa(), defaults, overrides);

  // @see https://github.com/koajs/qs#whats-different
  return koaQs(app, 'strict');
};

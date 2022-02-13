// @flow

import ratelimit from 'koa-ratelimit';

import type { Context, MiddlewareFactoryType, ObjectType } from '../libdefs';

const db = new Map();

// @see https://github.com/koajs/ratelimit#with-a-memory-driver
export const rateLimitConfig: ObjectType = {
  db,
  disableHeader: false,
  driver: 'memory',
  duration: 60000,
  errorMessage: 'Sometimes You Just Have to Slow Down.',
  headers: {
    remaining: 'Rate-Limit-Remaining',
    reset: 'Rate-Limit-Reset',
    total: 'Rate-Limit-Total',
  },
  id: (ctx: Context) => ctx.ip,
  max: 100,
  // whitelist: (ctx) => {
  // some logic that returns a boolean
  // },
  // blacklist: (ctx) => {
  // some logic that returns a boolean
  // }
};

export const koaRateLimit: MiddlewareFactoryType = (app) => ratelimit(rateLimitConfig);

// @flow

import ratelimit from 'koa-ratelimit';

const db = new Map();

// @see https://github.com/koajs/ratelimit#with-a-memory-driver
// fear the copypasta
const CONFIG = {
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
  id: (ctx) => ctx.ip,
  max: 100,
  // whitelist: (ctx) => {
  // some logic that returns a boolean
  // },
  // blacklist: (ctx) => {
  // some logic that returns a boolean
  // }
};

export const koaRatelimit = async (config = CONFIG, app) => {
  return ratelimit(config);
};

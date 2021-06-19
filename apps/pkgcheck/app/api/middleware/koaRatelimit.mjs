
import ratelimit from 'koa-ratelimit';

const db = new Map();

// @see https://github.com/koajs/ratelimit#with-a-memory-driver
// fear the copypasta
const CONFIG = {
  driver: 'memory',
  db,
  duration: 60000,
  errorMessage: 'Sometimes You Just Have to Slow Down.',
  id: (ctx) => ctx.ip,
  headers: {
    remaining: 'Rate-Limit-Remaining',
    reset: 'Rate-Limit-Reset',
    total: 'Rate-Limit-Total'
  },
  max: 100,
  disableHeader: false,
  // whitelist: (ctx) => {
  // some logic that returns a boolean
  // },
  // blacklist: (ctx) => {
  // some logic that returns a boolean
  // }
}

export default function koaRatelimit (config = CONFIG, app) {
  return ratelimit(config);
}

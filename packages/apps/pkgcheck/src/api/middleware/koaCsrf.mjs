
import CSRF from 'koa-csrf';

// @see https://github.com/koajs/csrf#usage
// TODO(noah)
// +finish setting up this middleware

// fear the copypasta
const CONFIG = {
  invalidTokenMessage: 'Invalid CSRF token',
  invalidTokenStatusCode: 403,
  excludedMethods: [
    'GET',
    'HEAD',
    'OPTIONS'
  ],
  disableQuery: false,
}

export default function koaCsrf (config = CONFIG, app) {
  return new CSRF(config);
}

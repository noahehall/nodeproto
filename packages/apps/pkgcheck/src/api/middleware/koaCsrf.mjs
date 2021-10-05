// @flow strict

import CSRF from 'koa-csrf';

// @see https://github.com/koajs/csrf#usage
// TODO(noah)
// +finish setting up this middleware

// fear the copypasta
const CONFIG = {
  disableQuery: false,
  excludedMethods: ['GET', 'HEAD', 'OPTIONS'],
  invalidTokenMessage: 'Invalid CSRF token',
  invalidTokenStatusCode: 403,
};

export default function koaCsrf (config = CONFIG, app) {
  return new CSRF(config);
}

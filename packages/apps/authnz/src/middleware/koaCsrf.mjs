// @flow

import CSRF from 'koa-csrf';

import type { MiddlewareConfigKoaAppType } from '../libdefs';

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

export const koaCsrf: MiddlewareConfigKoaAppType = async (config = CONFIG, app) => new CSRF(config);

// @flow

import CSRF from 'koa-csrf';

import type { MiddlewareFactoryType } from '../libdefs';

// @see https://github.com/koajs/csrf#usage
export const koaCsrfConfig: {
  disableQuery: boolean,
  excludedMethods: string[],
  invalidTokenMessage: string,
  invalidTokenStatusCode: number,
} = {
  disableQuery: false,
  excludedMethods: ['GET', 'HEAD', 'OPTIONS'],
  invalidTokenMessage: 'Invalid CSRF token',
  invalidTokenStatusCode: 403,
};

export const koaCsrf: MiddlewareFactoryType = (app) => new CSRF(koaCsrfConfig);

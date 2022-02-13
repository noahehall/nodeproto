// @flow

/**
 * for handling multipart form bodies
 */
import body from 'koa-body';
import bodyParser from 'koa-bodyparser';

import type { MiddlewareFactoryType } from '../libdefs';

// multipart, urlencoded, and json request bodies.
export const koaBody: MiddlewareFactoryType =  (app) => {
  // @see https://github.com/koajs/koa-body#options
  const koaBodyOptions = {};

  return body(koaBodyOptions);
};

// should only be used for the openapi route
// json, form and text request bodies
export const koaBodyParser: MiddlewareFactoryType = (app) => {
  // @see https://github.com/koajs/bodyparser#options
  const koaBodyOptions = {};

  return bodyParser(koaBodyOptions);
};

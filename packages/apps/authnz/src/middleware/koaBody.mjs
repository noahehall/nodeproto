// @flow

/**
 * for handling multipart form bodies
 */
import body from 'koa-body';
import bodyParser from 'koa-bodyparser';

import type { MiddlewareConfigKoaAppType } from '../libdefs';

// handles forms
export const koaBody: MiddlewareConfigKoaAppType = async (conf, app) => {
  return body();
};

// doesnt handle forms
// required (temporarily) for koa-oas3
// default app body parser
export const koaBodyParser: MiddlewareConfigKoaAppType = async (conf, app) => {
  return bodyParser();
};

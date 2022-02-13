// @flow

import charset from 'koa-charset';

import type {
  MiddlewareFactoryType,
  MiddlewareType,
} from '../libdefs';

// enforces the content-type response header is set to the char
// @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
// the default charset, short circuits charset logic unless changed by other handlers
// ^ e.g. stream/buffer content-type shouldnt be
// @see https://github.com/koajs/charset/blob/master/index.js#L29
export const koaCharset: MiddlewareFactoryType = (app) => {
  // @see https://github.com/koajs/charset#options
  return charset({ charset: app.context.config.charset });
};

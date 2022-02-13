// @flow

import charset from 'koa-charset';
import compose from 'koa-compose';

import type {
  MiddlewareComposeType,
  MiddlewareContextNextType,
} from '../libdefs';

export const charsetHandler: MiddlewareContextNextType = async (ctx, next) => {
  ctx.charset = 'utf8';
};

export const koaCharset: MiddlewareComposeType = async () => {
  return compose([charset, charsetHandler]);
};

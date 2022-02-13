// @flow

import type { MiddlewareFactoryType } from '../libdefs';

// TODO
// see how everyone else from koa is doing this
// vs our koa.introduction.copypasta
export const responseTime: MiddlewareFactoryType = (app) => {
  return async (ctx, next) => {
    const start = Date.now();

    await next();

    if (!ctx.response.headerSent) {
      ctx.response.append('X-Response-Time', String(Date.now() - start));
    }
  };
};

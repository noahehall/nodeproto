// @flow

import { logIt } from '@nodeproto/shared';

import { isFaviconRequest, resGet } from '../utils';

import type { MiddlewareFactoryType } from '../libdefs';

export const logger: MiddlewareFactoryType = (app) => {
  return async (ctx, next) => {
    if (isFaviconRequest(ctx.path)) return;

    await next();

    const rt = resGet(ctx, 'X-Response-Time');

    logIt(`request: ${ctx.method}: ${ctx.url} ${String(rt)}ms}`);
  };
};

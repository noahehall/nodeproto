// @flow

import { logIt } from '@nodeproto/shared';

import { isFaviconRequest, resGet } from '../utils';

import type { MiddlewareType } from '../libdefs';

export const logger: MiddlewareType = async (config, app) => {
  return async (ctx, next) => {
    if (isFaviconRequest(ctx.path)) return;

    await next();

    const rt = resGet(ctx, 'X-Response-Time');

    logIt(`pkgcheck: ${ctx.method}: ${ctx.url} ${String(rt)}ms}`);
  };
};

// @flow

import { logIt } from '@nodeproto/shared';

import { isFaviconRequest, resGet } from '../shared';

export const logger = async (config, app) => {
  return async (ctx, next) => {
    if (isFaviconRequest(ctx.path)) return;

    await next();

    const rt = resGet(ctx, 'X-Response-Time');

    logIt(`pkgcheck: ${ctx.method}: ${ctx.url} ${rt}ms\nBody: \n${ctx.body}`);
  };
};

// @flow

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag
 *
 */
import { eTag as tinyETag } from '@tinyhttp/etag';

import type { MiddlewareFactoryType } from '../libdefs';

// TODO(noah)
// +ensure this is last
// +to check modifications to body?
export const eTag: MiddlewareFactoryType = (app) => {
  return async (ctx, next) => {
    if (ctx.method !== 'GET') return;

    next();

    if (!ctx.response.body || ctx.response.headerSent) return;

    console.info('\n\n setting etag', tinyETag(ctx.response.body));

    ctx.response.append('ETag', tinyETag(ctx.response.body));
  };
};

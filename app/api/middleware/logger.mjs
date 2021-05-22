'use strict';

import { resGet, isFaviconRequest } from '../shared.mjs';

const log = msg => console.log(`\n\nasyncLogger: ${msg}`);

// TODO
// find a real logging middleware;
export default function logger (config, app) {
  return async (ctx, next) => {

    if (isFaviconRequest(ctx.path)) return;

    await next();

    const rt = resGet(ctx, 'X-Response-Time');

    log(`${ctx.method}: ${ctx.url} ${rt}ms\nBody: \n${ctx.body}`
    );
  }
}


'use strict';

import { resGet } from '../shared.mjs';

const logIt = msg => console.log(`asyncLogger: ${msg}`);

export default async (ctx, next) => {
  await next();

  const rt = resGet(ctx, 'X-Response-Time');

  logIt(`${ctx.method}: ${ctx.url} ${rt}ms`);
}


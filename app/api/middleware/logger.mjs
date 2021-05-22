'use strict';

import { resGet } from '../shared.mjs';

const log = msg => console.log(`asyncLogger: ${msg}`);

export default async (ctx, next) => {
  await next();

  const rt = resGet(ctx, 'X-Response-Time');

  log(`${ctx.method}: ${ctx.url} ${rt}ms`);
}


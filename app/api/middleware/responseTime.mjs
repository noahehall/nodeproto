'use strict';

export default async (ctx, next) => {
  const start = Date.now();

  await next();

  ctx.set('X-Response-Time', Date.now() - start);
};

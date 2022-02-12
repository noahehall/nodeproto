// @flow

// TODO
// see how everyone else from koa is doing this
// vs our koa.introduction.copypasta
export const responseTime = async (config, app) => {
  return async (ctx, next) => {
    const start = Date.now();

    await next();

    if (!ctx.response.headerSent) {
      ctx.response.append('X-Response-Time', Date.now() - start);
    }
  };
};

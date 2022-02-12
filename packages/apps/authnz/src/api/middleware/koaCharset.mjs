// @flow
import charset from 'koa-charset';
import compose from 'koa-compose';

export const charsetHandler = async (ctx, next) => {
  ctx.charset = 'utf8';
};

export const koaCharset = async () => {
  return compose([charset, charsetHandler]);
};

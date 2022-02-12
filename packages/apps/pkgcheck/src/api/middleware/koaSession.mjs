// @flow

// TODO
// [add redis](https://github.com/koajs/session#external-session-stores)

import compose from 'koa-compose';
import session from 'koa-session';

// fear the copypasta
// https://github.com/koajs/session#example
// TODO(noah)
// +review these options as autoCommit fks shit up
const CONFIG = {
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  autoCommit: true /** (boolean) automatically commit headers (default true) */,
  httpOnly: true /** (boolean) httpOnly or not (default true) */,
  key: 'koa.sess' /** (string) cookie key (default is koa.sess) */,
  maxAge: 86400000,
  overwrite: true /** (boolean) can overwrite or not (default true) */,
  renew: false /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false) */,
  rolling: false /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */,
  sameSite: null /** (string) session cookie sameSite options (default null, don't set it) */,
  secure: false /** (boolean) secure cookie */,
  signed: true /** (boolean) signed or not (default true) */,
};

export const sessionHandler = async (ctx, next) => {
  const {
    session: { views = 0 },
  } = ctx;
  ctx.session.views = views + 1;

  next();
};
export const koaSession = async ({ useHandler = true, ...conf } = {}, app) => {
  const s = session({ ...CONFIG, ...conf }, app);

  return useHandler ? compose([s, sessionHandler]) : s;
};

'use strict';

/**
 *
 * @param t thing
 * @param r ctx[request|response]
 * @returns value of thing in ctx[request|response]
 */
const ctxGet = (t, r) => r.get(t);

/**
 *
 * @param c ctx
 * @param t thing
 * @returns ctxGet(thing, ctx.response)
 */
export const resGet = (c, t) => ctxGet(t, c.response);

/**
 *  returns request header field
 * @param c ctx
 * @param t thing
 * @returns ctxGet(thing, ctx.request)
 */
export const reqGet = (c, t) => ctxGet(t, c.request);

/**
 * TODO: change to envGet
 * @param t thing
 * @param d default|package.json.config.THING
 * @param e process.env
 * @returns value of thing in process.env|pkjson.config else undefined
 */
export const getEnv = (
  t,
  d = process.env[`npm_package_config_${t}`],
  e = process.env
) => t in e ? e[t] : d;

/**
 * check is ctx.path === '/favicon.ico'
 * @param p ctx.path
 * @returns bool
 */
export const isFaviconRequest = p => (
  p === '/favicon.ico'
);

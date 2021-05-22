'use strict';

/**
 *
 * @param c ctx
 * @param t thing
 * @param r ctx.response
 * @returns r.get(thing)
 */
export const resGet = (c, t, r = c.response) => r.get(t);

/**
 *
 * @param t thing
 * @param d default|package.json.config.THING
 * @param e process.env
 * @returns
 */
export const getEnv = (
  t,
  d = process.env[`npm_package_config_${t}`],
  e = process.env
) => t in e ? e[t] : d;

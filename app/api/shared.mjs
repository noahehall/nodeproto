'use strict';

/**
 *
 * @param c ctx
 * @param t thing
 * @param r ctx.response
 * @returns r.get(thing)
 */
export const resGet = (c, t, r = c.response) => r.get(t);


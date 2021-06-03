'use strict';

/**
 * shit releted to environment management
 */


import dotenv from 'dotenv';

// load env
const parsed = dotenv.config().parsed;

/**
 *
 */

/**
 * injects .env variables into an object
 * + suitable for updating node.js process.env @ build/run time
 *
 * @param env [default=dotenv.config().parsed] object of {key:value}
 * @returns object of {process.env.KEY: VALUE, ...}
 */
export const buildEnv = (env = parsed) => Object.entries(env)
  .reduce(
    (a, [k, v]) => (a[`process.env.${k}`] = '"' + env[k] + '"') && a,
    {}
  );


/**
 * upserts env into opts.config
 * + matching keys in opts.config will be overwritten with values from env
 *
 * @param opts container for config, e.g. a package.json
 * @returns opts with opts.config synced to values in env
 */
export const syncConfig = ({ config = {}, ...opts} = {}) => ({
  ...opts,
  config: Object.assign({}, config, parsed)
});

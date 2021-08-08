
/* eslint-disable comma-dangle */

/**
 * shit releted to environment variables
 */

import dotenv from 'dotenv';

// load env
const { parsed } = dotenv.config();
const wrapValue = v => (`"${v}"`)

// cmdline args override
process.argv.slice(2).forEach(argv => {
  if (!argv.includes('=')) return;

  const [
    arg,
    v
  ] = argv.split('=');

  parsed[arg] = v;
})

/**
 * injects .env variables into an object
 * + suitable for adding .env vars  to a webpack|esbuild define plugin config as process.env.THING:VALUE
 *
 * @param env [default=dotenv.config().parsed] object of {key:value}
 * @returns object of {process.env.KEY: VALUE, ...}
 */
export const buildEnv = (env = parsed) => Object.entries(env)
  .reduce(
    (a, [
      k,
      v
    ]) => {
      a[`process.env.${k}`] = wrapValue(env[k]);
      process.env[k] = env[k];

      return a;
    },
    {}
  )

/**
 * uses the default config.values for env variables present but undefined in the .env file
 * updates process.env if it exists
 *
 * @param param0 container for config, e.g. a package.json
 * @returns  { parsed, processEnv } containing new env in parsed, and formatted env in processEnv (keys as process.env.K)
 */
export const syncEnv = ({ config = {}, ...opts } = {}) => {
  for (const k in config) {
    if (config.hasOwnProperty(k) && parsed[k]?.length === 0) { // eslint-disable-line no-prototype-builtins
      // update the global process.env if it exists
      // update parsed created by dotenv
      if (process?.env) process.env[k] = config[k]
      parsed[k] = config[k]
    }
  }

  return { parsed, processEnv: buildEnv() }
}

/**
 * upserts env into opts.config
 * + matching keys in opts.config will be overwritten with values from env
 *
 * @param param0 container for config, e.g. a package.json
 * @returns opts with opts.config synced to values in env
 */
export const syncConfig = ({ config = {}, ...opts } = {}) => ({
  ...opts,
  config: { ...config, ...parsed }
})

/**
 * pushes .env values into param0.config and injects param0.config values into process.env if process.env values are undefined
 * @param param0 container for a config, e.g. a package.json
 * @returns { config, processEnv, parsed, ...opts } with updated values
 */
export const syncEnvAndConfig = ({ config = {}, ...opts }) => ({

  ...syncEnv({ config }), // must come first!
  ...syncConfig({ config, ...opts }),
})

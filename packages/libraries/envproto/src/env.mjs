// @flow

import dotenv from 'dotenv';

import type { ObjectOfStrings, ObjectType } from "./libdefs";

export const wrapValue = (v: any): string => `"${v}"`;

export let parsed: ObjectType = dotenv.config().parsed;

// cmdline args override
process.argv.slice(2).forEach((argv) => {
  if (!argv.includes('=')) return;

  const [arg, v]: string[] = argv.split('=');

  parsed[arg] = v;
});

// @see https://nodejs.org/api/cli.html#cli_c_condition_conditions_condition
// useful when you want to augment node.env
// e.g. NODE_ENV=development node --condition=test poop.js
export const getConditions = (condition: string = ''): string[] => {
  const conditions = process.execArgv.filter((x) => x.startsWith('--conditions'));

  return condition
    ? conditions.filter((c) => c.toLowerCase().endsWith(condition.toLowerCase()))
    : conditions;
};

export const clearBaseEnv = (): void => {parsed = {};};

export const updateBaseEnv = (env: ObjectType = {}): void => {
  Object.entries(env).forEach(([key, value]) => (parsed[key] = value));
};

// suitable for injecting env vars into a webpack|esbuild define plugin
// updates process.env
export const buildEnv = (env: ObjectType = parsed): ObjectOfStrings =>
  Object.entries(env).reduce((a, [k]) => {
    a[`process.env.${k}`] = wrapValue(env[k]);
    // $FlowIgnore[unnecessary-optional-chain]
    if (process?.env) process.env[k] = String(env[k]);

    return a;
  }, {});

/**
 * uses the default config.values for env variables present but undefined in the .env file
 * updates process.env if it exists
 */
export const syncEnvWithConfig = ({ config = {} }: { config: ObjectType} = {}): {
  parsed: ObjectType,
  processEnv: ObjectOfStrings,
} => {
  Object.entries(config).forEach(([k, v]) => {
    if (parsed[k] === '') {
      parsed[k] = v;

      // update the global process.env if it exists
      // update parsed created by dotenv
      // $FlowIgnore[unnecessary-optional-chain]
      if (process?.env) process.env[k] = String(v);
    }
  });

  return { parsed, processEnv: buildEnv() };
};

/**
 * upserts env into opts.config
 * matching keys in config will be overwritten with values from env
 */
export const syncConfigWithEnv = ({ config = {} }: { config: ObjectType }): ObjectType => ({
  ...config,
  ...parsed,
});

/**
 * ensures env & config are in sync
 */
export const syncEnvAndConfig = ({ config = {} }: { config: ObjectType }): {
  config: ObjectType,
  processEnv: ObjectOfStrings,
} => {
  // upsert default values into env
  const { processEnv } = syncEnvWithConfig({ config });

  // upsert env into config
  return {
    config: syncConfigWithEnv({ config }),
    processEnv,
  };
};

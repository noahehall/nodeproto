// @flow

import {
  dirname,
  getPkgJson,
  getPkgJsonc,
  logIt,
  throwIt,
} from '@nodeproto/shared';

import type { ObjectType } from '@nodeproto/configproto/libdefs';

import { SPREAD_VALUES } from './constants';

import path from 'path';

const importMetaUrl = import.meta.url;

export const diskPath: string = path.resolve(dirname((typeof importMetaUrl === 'string' ? importMetaUrl : process.cwd())), '..');
export const internalConfigPromise: Promise<ObjectType> = getPkgJsonc(diskPath);

export const getRootPkgJson = async ({
  maxLookups,
  currentDir
}: {
  maxLookups: number,
  currentDir: string
}): Promise<ObjectType> => {
  if (maxLookups < 0) throwIt(
    `unable to find root package.json, ending search in ${currentDir}`
  );

  const { file: json, path: jsonPath } = await getPkgJson(currentDir);

  return json?.jsync?.root
    ? { json, jsonPath }
    : getRootPkgJson({
        currentDir: path.resolve(currentDir, '..'),
        maxLookups: maxLookups - 1,
      });
};

export const childPkgJsonPath: string = process.env.CHILD_PKG_JSON_PATH || process.cwd();

export const childPkgJsonPromise: Promise<ObjectType> = getPkgJson(childPkgJsonPath);

/**
 * @description
 * spreads { default, root, child } jsync configs
 */
export const getFiles = async (): Promise<ObjectType> => {
  const internalConfig = (await internalConfigPromise).file.jsync;

  if (!internalConfig) throwIt(`unable to find internal jsync config @ path ${diskPath}`);

  const { json: { jsync: rootConfig, ...rootJson } } = await getRootPkgJson({
    maxLookups: internalConfig.maxLookups,
    currentDir: path.resolve(diskPath, '..'),
  });

  if (!rootConfig || !rootJson) throwIt(`unable to find root pkgJson @ path ${diskPath}`);

  const { file: childJson } = await childPkgJsonPromise;


  if (!childJson) throwIt(`unable to find child pkgJson @ path ${childPkgJsonPath}`);

  if (!childJson.jsync) throwIt(`child pkgJson does not have jsync config @ path ${childPkgJsonPath}`);

  return {
    config: {
      ...internalConfig,
      ...rootConfig,
      ...childJson.jsync,
    },
    rootJson,
    childJson,
  };
};

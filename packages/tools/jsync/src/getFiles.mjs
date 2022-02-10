// @flow

import {
  dirname,
  getPkgJson,
  getPkgJsonc,
  logIt,
  throwIt,
} from '@nodeproto/shared';

import path from 'path';

import { SPREAD_VALUES } from './constants';

import type { JsyncConfigType, JsyncMetaType, PkgJsonType } from './libdefs';

const importMetaUrl = import.meta.url;

export const diskPath: string = path.resolve(dirname((typeof importMetaUrl === 'string' ? importMetaUrl : process.cwd())), '..');
export const internalConfigPromise: Promise<JsyncMetaType> = getPkgJsonc(diskPath);

export const getRootPkgJson = async ({
  maxLookups,
  currentDir
}: {
  maxLookups: number,
  currentDir: string
}): Promise<JsyncMetaType> => {
  if (maxLookups < 0) throwIt(
    `unable to find root package.json, ending search in ${currentDir}`
  );

  const pkgJsonMeta = await getPkgJson(currentDir);

  return pkgJsonMeta.file?.jsync?.root === true
    ? pkgJsonMeta
    : getRootPkgJson({
        currentDir: path.resolve(currentDir, '..'),
        maxLookups: maxLookups - 1,
      });
};

export const childPkgJsonPath: string = process.env.CHILD_PKG_JSON_PATH || process.cwd();

export const childPkgJsonPromise: Promise<JsyncMetaType> = getPkgJson(childPkgJsonPath);

/**
 * @description
 * spreads { default, root, child } jsync configs
 */
export const getFiles = async (): Promise<{
  config: JsyncConfigType,
  rootJson: PkgJsonType,
  childJson: PkgJsonType,
} | void> => {
  const internalConfig = (await internalConfigPromise).file?.jsync;

  if (!internalConfig) throwIt(`unable to find internal jsync config @ path ${diskPath}`);

  const { file: { jsync: rootConfig, ...rootJson } = {} } = await getRootPkgJson({
    currentDir: path.resolve(diskPath, '..'),
    maxLookups: typeof internalConfig?.maxLookups === 'number' ? internalConfig.maxLookups : 10
  });

  if (!rootConfig || !rootJson) throwIt(`unable to find root pkgJson @ path ${diskPath}`);

  const { file: childJson } = await childPkgJsonPromise;

  if (!childJson) throwIt(`unable to find child pkgJson @ path ${childPkgJsonPath}`);

  else if (!childJson.jsync) throwIt(`child pkgJson does not have jsync config @ path ${childPkgJsonPath}`);

  else {
    return {
      config: Object.assign({}, internalConfig, rootConfig, childJson.jsync),
      rootJson,
      childJson,
    };
  }
};

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

export const diskPath: string = path.resolve(dirname(import.meta.url), '..');
export const JSYNC_CONFIG: Promise<ObjectType> = (await getPkgJsonc(diskPath))?.file?.jsync; // eslint-disable-line

if (!JSYNC_CONFIG)
  throwIt(`unable to find jsync config in ${diskPath} or ${process.env.JSYNC_CONFIG_PATH}`);

export const getRootPkgJson = async ({
  maxLookups,
  currentDir
}: {
  maxLookups: number,
  currentDir: string
}): Promise<ObjectType> => {
  if (!maxLookups) throwIt(
    `unable to find root packageFile in getRootPkgJson`
  );

  const { file: json, path: jsonPath } = await getPkgJson(currentDir);

  return json?.jsync?.root
    ? { json, jsonPath }
    : getRootPkgJson({
        currentDir: path.resolve(currentDir, '..'),
        maxLookups: --maxLookups,
      });
};

export const childPkgJsonPath: string = process.env.CHILD_PKG_JSON_PATH || process.cwd();

export const childPkgJson: Promise<ObjectType> = await getPkgJson(childPkgJsonPath);

// finalize child jsync config
if (!childPkgJson?.file?.jsync)
  throwIt(`invalid child package.json file: missing jsync property ${childPkgJson}`);

let tempCategory: string = SPREAD_VALUES;

export const getJsyncConfig = (): ObjectType => {
  for (const key in childPkgJson.file.jsync) {
    if (childPkgJson.file.jsync[key].includes?.('*')) {
      if (!tempCategory) tempCategory = key;
      childPkgJson.file.jsync[key] = childPkgJson.file.jsync[key].filter((k) => k !== '*');
    }
  }

  for (const key in JSYNC_CONFIG) {
    if (JSYNC_CONFIG[key].includes?.('*')) {
      if (!tempCategory) tempCategory = key;
      JSYNC_CONFIG[key] = JSYNC_CONFIG[key].filter((k) => k !== '*');
    }
  }

  return {
    ...JSYNC_CONFIG,
    ...childPkgJson.file.jsync,
    DEFAULT_CATEGORY: tempCategory
  };
};

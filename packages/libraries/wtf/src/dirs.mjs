// @flow

import { homedir, tmpdir } from 'os';
import { wtf as wtfShared } from '@nodeproto/shared';

import cPath from 'contains-path';
import globalDirs from 'global-dirs';
import symlinkDir from 'symlink-dir';
import xdg from '@folder/xdg';

import type { ObjectType } from '@nodeproto/configproto/libdefs';

const { external, ...internal } = wtfShared;

export const getDirs = (overrides: ObjectType = {}): ObjectType => {
  return {
    ...external,
    ...internal,
    ...xdg({
      env: process.env,
      expanded: true,
      homedir: homedir(),
      platform: process.platform,
      tempdir: tmpdir(),
    }),
    cPath,
    globalDirs,
    inceptionStore: `${homedir()}/.node_modules`,
    symlinkDir,

    ...overrides,
  };
};

export const dirs: ObjectType = getDirs();

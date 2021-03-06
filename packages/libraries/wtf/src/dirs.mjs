// @flow

import { homedir, tmpdir } from 'os';
import { wtf as wtfShared } from '@nodeproto/shared';

import cPath from 'contains-path';
import globalDirs from 'global-dirs';
import symlinkDir from 'symlink-dir';
import xdg from '@folder/xdg';

import type { DirsType, ObjectType } from './libdefs';

const { external, ...internal } = wtfShared;

export const getDirs = (overrides: ObjectType = {}): DirsType => {
  return Object.freeze(Object.assign(
    {},
    { inceptionStore: `${homedir()}/.node_modules` },
    cPath,
    external,
    globalDirs,
    internal,
    symlinkDir,
    xdg({
      env: process.env,
      expanded: true,
      homedir: homedir(),
      platform: process.platform,
      tempdir: tmpdir(),
    }),
    overrides
  ));
};

export const dirs: DirsType = getDirs();

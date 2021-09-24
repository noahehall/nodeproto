
import { homedir, tmpdir } from 'os';
import { wtf as wtfShared } from '@nodeproto/shared';

import cPath from 'contains-path';
import Dirent from 'dirent';
import globalDirs from 'global-dirs';
import path from 'path';
import symlinkDir from 'symlink-dir';
import xdg from '@folder/xdg';

const { external, ...internal } = wtfShared;

export const getDirs = (overrides = {}) => {
  return {
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

    ...external,
    ...internal,

    ...overrides,
  };
};

export const dirs = getDirs();

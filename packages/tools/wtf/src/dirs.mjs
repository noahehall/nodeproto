
import { homedir, tmpdir } from 'os';
import { wtf as wtfShared } from '@nodeproto/shared';

import cPath from 'contains-path';
import Dirent from 'dirent';
import globalDirs from 'global-dirs';
import path from 'path';
import symlinkDir from 'symlink-dir';
import xdg from '@folder/xdg';

/**
 * gets cross-platform directories
 *
 * @see https://github.com/folder/xdg
 * @see https://github.com/jonschlinkert/contains-path
 * @see https://github.com/folder/readdir
 * @see https://github.com/folder/readdir#tips--tricks
 * @see https://github.com/jonschlinkert/global-modules/blob/master/index.js
 *
 * @TODO https://www.npmjs.com/package/unixify
 * @return {object} properties and methods supporting filesystem management
 */

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

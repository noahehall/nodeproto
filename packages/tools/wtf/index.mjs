import { homedir, tmpdir } from 'os';
import cPath from 'contains-path';
import Dirent from 'dirent';
import fs from 'fs-extra';
import path from 'path';
import picomatch from 'picomatch';
import readdir from '@folder/readdir';
import xdg from '@folder/xdg';
import globalDirs from 'global-dirs';


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
export const getDirs = () => {
  const readdirOptions = {
    absolute: true,
    depth: 2,
    dot: false,
    // basename: e.g. $HOME, // required if absolute:false,
    // filter: mustContainThisPath e.g. 'poop',
    follow: true, // symlinks
    // isMatch: someRegex, see filter
  };

  return {
    ...xdg({
      expanded: true,
      env: process.env,
      homedir: homedir(),
      platform: process.platform,
      tempdir: tmpdir(),
    }),
    cPath,
    globalDirs,
    inceptionStore: `${homedir()}/.node_modules`,
    async readdir ({ dirpath, glob, ...opts}) {
      return readdir(
        dirpath,
        {...readdirOptions, ...opts, isMatch: glob ? file => picomatch(glob)(file.relative) : undefined }
      );
    },
  };
}

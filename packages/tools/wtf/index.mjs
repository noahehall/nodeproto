import { homedir, tmpdir } from 'os';
import cPath from 'contains-path';
import Dirent from 'dirent';
import fs from 'fs-extra';
import globalDirs from 'global-dirs';
import JSONC from 'jsonc-simple-parser';
import path from 'path';
import picomatch from 'picomatch';
import Readdir from '@folder/readdir';
import shelljs from 'shelljs';
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

  const readdir = async ({ dirpath, glob, ...opts}) => {
    return Readdir(
      dirpath,
      {...readdirOptions, ...opts, isMatch: glob ? file => picomatch(glob)(file.relative) : undefined }
    );
  };

  const getFilePathAbs = async (dirpath = '.', glob) => (await readdir({ dirpath, glob }));

  const getPkgJsonAbs = async (dirpath = '.', glob) => (await getFilePathAbs(dirpath, glob))[0];

  const getPkgJson = async (dirpath = '.', glob = 'package\.json') => {
    const pkgJsonAbs = await getPkgJsonAbs(dirpath, glob);

    return pkgJsonAbs && JSONC.parse(shelljs.cat(pkgJsonAbs))
  }

  const getPkgJsonc = async (dirpath = '.') => getPkgJson(dirpath, 'package\.jsonc')


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
    readdir,
    getFilePathAbs,
    getPkgJsonAbs,
    getPkgJson,
    getPkgJsonc,
  };
}

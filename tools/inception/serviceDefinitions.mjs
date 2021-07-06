import { homedir, tmpdir } from 'os';
import cPath from 'contains-path';
import Dirent from 'dirent';
import fs from 'fs';
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
const getDirs = () => {
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

export const dirs = getDirs();


export const globalOptions = {
  chokidarConfig: {},
  runner: 'npm run', // enum(true)
  watchGlob: /src\/.*\.(c|m)?js|css|tsx$/, // javascript and css files
}


// @see https://github.com/nodejs/node-eps/blob/master/002-es-modules.md#4-compatibility
// symlinks to ~/.node_modules will always work, with a performance hit but hey
/**
 * destructure to create a new dependency
 */
const defaultService = {
  // chokidarConfig: {}, // TODO: currently using a single watcher for all deps
  // runner: 'npm run', // e.g. yarn|rushx|npx
  // watchGlob: /src\/.*\.(c|m)?js|css|tsx$/, // javascript and css files
  scriptBuild: '', // e.g. build
  scriptStart: '', // e.g. start
  upstreamDeps: [], // pkgJson.name, list of pkgs this pkg depends on
  watch: true,
  workDir: '', // directory with pkg.json, must be unique
}

export const dep1 = {
  ...defaultService,
  workDir: './fixtures/fakedeps/dep1',
  upstreamDeps: ['dep2'],
  scriptBuild: 'build:dep1',
}

export const dep2 = {
  ...defaultService,
  workDir: './fixtures/fakedeps/dep2',
  scriptBuild: 'build',
}

export const client = {
  ...defaultService,
  workDir: '../../apps/client',
  scriptStart: 'start:dev',
  upstreamDeps: ['dep1'],
}


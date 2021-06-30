import { homedir, tmpdir } from 'os';
import cPath from 'contains-path';
import Dirent from 'dirent';
import fs from 'fs';
import path from 'path';
import picomatch from 'picomatch';
import prefix from 'global-prefix';
import readdir from '@folder/readdir';
import xdg from '@folder/xdg';

// copy pasta
// @see https://github.com/jonschlinkert/global-modules/blob/master/index.js
function getGlobalDir() {
  if (process.platform === 'win32' || process.env.OSTYPE === 'msys' || process.env.OSTYPE === 'cygwin') {
    return path.resolve(prefix, 'node_modules');
  }
  return path.resolve(prefix, 'lib/node_modules');
}
const globalDir = getGlobalDir();

/**
 * gets cross-platform directories
 * @see https://github.com/folder/xdg
 * @see https://github.com/jonschlinkert/contains-path
 * @see https://github.com/folder/readdir
 * @see https://github.com/folder/readdir#tips--tricks
 * @see https://github.com/jonschlinkert/global-modules/blob/master/index.js
 * @see https://github.com/jonschlinkert/global-prefix/blob/master/index.js
 *
 * @TODO https://www.npmjs.com/package/unixify
 * @return {*}
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
    globalDir,
    async readdir ({ dirpath, glob, ...opts}) {
      return readdir(
        dirpath,
        {...readdirOptions, ...opts, isMatch: glob ? file => picomatch(glob)(file.relative) : undefined }
      );
    },
  };
}

export const dirs = getDirs();

// examples
const fpath = await dirs.readdir({ dirpath: dirs.cwd, glob: '*/*.mjs' })
const file = new Dirent(fpath[0])

console.log(
  '\n\n wtf dirs',
  dirs,
  await dirs.readdir({ dirpath: dirs.cwd, glob: '*/*.mjs' }),

  '\n\n dirent',
  file.dirname,
  file.basename,
  file.stem,
  file.extname,

  '\n\n global intall dir',
  globalDir,

)

/**
 * destructure to create a new dependency
 */
const defaultService = {
  watchGlob: /src\/.*\.(c|m)?js|css|tsx$/, // javascript and css files
  chokidarConfig: {}, // TODO: currently using a single watcher for all deps
  name: '', // pkgJson.name // only required if pkgs have the same name (not sure why but hey),
  pushAfterBuild: true,
  pushWithoutBuild: false, // push a pkg without building it
  runner: 'npm run', // e.g. yarn|rushx|npx
  scriptBuild: '', // e.g. build
  scriptStart: '', // e.g. start
  upstreamDeps: [], // pkgJson.name, list of pkgs this pkg depends on
  watch: true,
  workDir: '', // ../../dirWithPkgJson
}


const baseDir = '../../../../foss/';

export const inceptionStore = `${homedir()}/node_modules`;


export const dep1 = {
  ...defaultService,
  workDir: baseDir + 'fakedeps/dep1',
  upstreamDeps: ['dep2'],
  scriptBuild: 'build:dep1',
}

export const dep2 = {
  ...defaultService,
  workDir: baseDir + 'fakedeps/dep2',
  scriptBuild: 'build',
}

export const client = {
  ...defaultService,
  workDir: baseDir + 'nodeproto/apps/client',
  runner: 'rushx',
  startScript: 'start:dev',
  upstreamDeps: ['dep1'],
}

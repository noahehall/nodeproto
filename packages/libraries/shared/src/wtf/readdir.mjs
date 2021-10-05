import fs from 'fs';
import JSONC from 'jsonc-simple-parser';
import picomatch from 'picomatch';
import Readdir from '@folder/readdir';

/**
  shelljs issue when running bundled code
  dont use shelljs

  import shelljs from 'shelljs';

  Uncaught Error: Cannot find module './src/cat'
  FYI: shelljs@0.8.4/node_modules/shelljs/shell.js
  // Load all default commands
  require('./commands').forEach(function (command) {
    require('./src/' + command);
  });
 */

const readdirOptions = {
  absolute: true,
  depth: 2,
  dot: false,
  // basename: e.g. $HOME, // required if absolute:false,
  // filter: mustContainThisPath e.g. 'poop',
  follow: true, // symlinks
  // isMatch: someRegex, see filter
};

export const external = {
  picomatch,
  JSONC,
};

export const readdir = async ({ dirpath, glob, ...opts }) => {
  return Readdir( // eslint-disable-line @babel/new-cap
    dirpath,
    {
      ...readdirOptions,
      ...opts,
      isMatch: glob ? file => picomatch(glob)(file.relative) : undefined
    }
  );
};

export const getFilePathAbs = async (dirpath = '.', glob) => (await readdir({ dirpath, glob }));

export const getPkgJsonAbs = async (dirpath = '.', glob) => (await getFilePathAbs(dirpath, glob))[0];

export const getPkgJson = async (dirpath = '.', glob = 'package.json', interpreter = JSONC.parse) => {
  const pkgJsonAbs = await getPkgJsonAbs(dirpath, glob);

  return pkgJsonAbs
    && {
      file: JSONC.parse(fs.readFileSync(pkgJsonAbs)),
      path: pkgJsonAbs,
    }
    || {};
};

export const getPkgJsonc = async (dirpath = '.') => getPkgJson(dirpath, 'package.jsonc');

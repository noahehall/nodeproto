// @flow

import fs from "fs";
import JSONC from "jsonc-simple-parser";
import picomatch from "picomatch";
import readdirOg from "@folder/readdir";

import type { ObjectType } from '@nodeproto/configproto/libdefs'; // eslint-disable-line

/**
  shelljs issue when running bundled code
  dont use shelljs

  import shelljs from 'shelljs';

  Uncaught Error: Cannot find module './src/cat'
  FYI: shelljs@0.8.4/node_modules/shelljs/shell.js
  // due to dynamic imports below
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
  picomatch, // @see https://github.com/micromatch/picomatch
  JSONC,
};

type Readdir = {
  (props: {
    absolute?: boolean,
    basename?: string,
    depth?: number,
    dirpath?: string,
    dot?: boolean,
    filter?: string,
    follow?: boolean,
    glob?: RegExp | string | void,
    isMatch?: boolean,
  }): any,
};
export const readdir: Readdir = async ({ dirpath, glob, ...opts }) => {
  if (!dirpath?.startsWith('/')) {
    throw new Error('dirpath must be absolute');
  }

  return readdirOg(dirpath, {
    ...readdirOptions,
    ...opts,
    isMatch: !glob ? undefined : (file) => picomatch(glob)(file.relative),
  });
};

export const getFilePathAbs = async (
  dirpath: string = ".",
  glob: RegExp | string
): Promise<string> => await readdir({ dirpath, glob });

// sugar for getting the first file found when searching for package.json
export const getPkgJsonAbs = async (
  dirpath: string = ".",
  glob: RegExp | string
): Promise<string> => (await getFilePathAbs(dirpath, glob))[0];

type PackageJsonMeta = {
  file?: ObjectType,
  path?: string,
}

export const getPkgJson = async (
  dirpath: string = ".",
  glob: string = "package.json",
  interpreter: Function = JSONC.parse
): Promise<PackageJsonMeta> => {
  const pkgJsonAbs = await getPkgJsonAbs(dirpath, glob);

  if (!pkgJsonAbs) return { file: undefined, path: undefined };

  return {
    file: JSONC.parse(fs.readFileSync(pkgJsonAbs)),
    path: pkgJsonAbs,
  };
};

// sugar for getting a pkg jsonc file
export const getPkgJsonc = async (
  dirpath: string = ".",
  glob: string = 'package.jsonc'
): Promise<ObjectType> => getPkgJson(dirpath, glob);

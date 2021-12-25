// @flow

import fs from "fs";
import JSONC from "jsonc-simple-parser";
import picomatch from "picomatch";
import readdirOg from "@folder/readdir";

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

export const getPkgJsonAbs = async (
  dirpath: string = ".",
  glob: RegExp | string
): Promise<string> => (await getFilePathAbs(dirpath, glob))[0];

export const getPkgJson = async (
  dirpath: string = ".",
  glob: string = "package.json",
  interpreter: Function = JSONC.parse
): Promise<{ [x: string]: any }> => {
  const pkgJsonAbs = await getPkgJsonAbs(dirpath, glob);

  return (
    (pkgJsonAbs && {
      file: JSONC.parse(fs.readFileSync(pkgJsonAbs)),
      path: pkgJsonAbs,
    }) ||
    {}
  );
};

export const getPkgJsonc = async (
  dirpath: string = "."
): Promise<{ [x: string]: any }> => getPkgJson(dirpath, "package.jsonc");

'use strict';

import fs from 'fs';
import path from 'path';
import util from 'util';
import esMain from 'es-main';

/**
 * determine if some file was invoked on CLI
 *
 * @param mod module
 * @param importMeta import.meta
 * @returns bool true if file was run directly
 */
export const isMain = (mod, importMeta) => {
  if (typeof require !== 'undefined') {
    return require.main == mod;
  }
  else {
    if (!(typeof importMeta)) throw 'must pass in import.meta';

    return esMain(importMeta)
  }
}

export const readFile = util.promisify(fs.readFile);
export const readFiles = async (files = []) => {
  return !files.length
  ? []
  : Promise.all(files.map(({filename, encoding = 'utf8'}) => (
      readFile(filename, encoding)
    )));
  }

export const writeFile = util.promisify(fs.writeFile);
export const writeFiles = async (files = []) => {
  return !files.length
    ? []
    : Promise.all(files.map(
      ({filename, data, encoding ='utf8', ...opts}) => writeFile(
          filename,
          data,
          { encoding, ...opts }
        )
      ));
};


export const parentUri = () => import.meta?.url ?? module.filename;
// directory where the code is being run
export const cwd = path.resolve('', path.dirname(parentUri()));
/**
 *
 * @param specifier filename
 * @param parent abs path
 * @returns
 */
export const resolve = async (specifier, parent = parentUri()) => {
  return import.meta?.resolve
    ? (await import.meta.resolve(specifier, parent)).replace('file://', '')
    : path.join(path.dirname(parent), specifier)
};

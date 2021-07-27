// TODO
// ^ move all this stuff into @nodeproto/wtf
import { fileURLToPath } from 'url';
import esMain from 'es-main';
import fs from 'fs';
import mkdirp from 'mkdirp'
import path from 'path';

/**
 * determine if some file was invoked on CLI
 *
 * @param mod module
 * @param importMeta import.meta
 * @returns bool true if file was run directly
 */
export const isMain = (requireMain, importMeta) => {
  if (typeof require !== 'undefined') {
    return requireMain == module;
  }

  if (!(typeof importMeta)) throw 'must pass in import.meta';

  return esMain(importMeta)
}

export const { readFile } = fs.promises;
export const readFiles = async (files = []) => (!files.length
  ? []
  : Promise.all(files.map(({ filename, encoding = 'utf8' }) => (
    readFile(
      filename,
      encoding
    )
  ))))

export const writeFile = async (...opts) => {
  try {
    await mkdirp(path.dirname(opts[0]));
  } catch (e) {} finally {
    return fs.promises.writeFile.apply(
      fs,
      opts
    );
  }
}

export const writeFiles = async (files = []) => (!files.length
  ? []
  : Promise.all(files.map(({ filename, data, encoding = 'utf8', ...opts }) => writeFile(
    filename,
    data,
    { encoding, ...opts }
  ))).catch(e => [e]));

export const parentUri = (importMeta = import.meta) => (
  importMeta?.url
    ? fileURLToPath(importMeta.url)
    : module.filename
);
// directory where the code is being run
// export const cwd = path.resolve('', path.dirname(parentUri()));
/**
 *
 * @param fileToImport filename
 * @param parent absolute path of the parent
 * @returns
 */
export const resolve = async (fileToImport, parent = parentUri()) => (import.meta?.resolve
  ? await import.meta.resolve(
    fileToImport,
    parent
  )
  : path.join(
    path.dirname(parent),
    fileToImport
  ));

import { fileURLToPath } from 'url';
import { fs as memfs } from 'memfs';

import esMain from 'es-main';
import fse from 'fs-extra';
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

  return esMain(importMeta);
};

export const parentUri = (importMeta = import.meta) => (
  importMeta?.url
    ? fileURLToPath(importMeta.url)
    : module.filename
);

// directory where the code is being run
// export const cwd = path.resolve('', path.dirname(parentUri()));
// @see https://github.com/stefanpenner/mjs-dirname/blob/main/index.mjs
/**
 *
 * @param fileToImport filename
 * @param parent absolute path of the parent
 * @returns
 */
export const resolve = async (fileToImport, parent = parentUri()) => (import.meta?.resolve
  ? await import.meta.resolve(fileToImport, parent)
  : path.join(path.dirname(parent), fileToImport));

export const fsProto = (disk = true) => {
  const fs = disk ? fse : memfs;

  return {
    fs,
    readFile: fs.readFile,
    readFiles: async (files = []) => (!files.length
      ? []
      : Promise.all(files.map(({ filename, encoding = 'utf8' }) => (
        fs.readFile(
          filename,
          encoding
        )
      )))),

    writeFile: async (...opts) => {
      try {
        await fs.ensureDir(path.dirname(opts[0]));
      } catch (e) {} finally {
        return fs.writeFile.apply(
          fs,
          opts
        );
      }
    },

    writeFiles: async (files = []) => (!files.length
      ? []
      : Promise.all(
          files.map(({ filename, data, encoding = 'utf8', ...opts }) => fs.writeFile(
            filename,
            data,
            { encoding, ...opts }
        ))).catch(e => [e])),
  };
};

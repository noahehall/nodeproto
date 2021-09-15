import { fileURLToPath } from 'url';
import { fs as memfs } from 'memfs';

import esMain from 'es-main';
import fse from 'fs-extra';
import path from 'path';

const r = (t, msg = 'is required') => { throw new Error(`${t}: ${msg}`); };

/**
 * determine if some file was invoked on CLI
 *
 * @param mod module
 * @param importMeta import.meta
 * @returns bool true if file was run directly
 */
export const isMain = (
  requireMain, // will be undefined in esm
  importMeta = r('importMeta: import.meta')
) => typeof requireMain !== 'undefined'
    ? requireMain == module
    : esMain(importMeta);

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
export const resolve = async (
  fileToImport = r('fileToImport: string'),
  parent = parentUri()
) => (import.meta?.resolve
  ? await import.meta.resolve(fileToImport, parent)
  : path.join(path.dirname(parent), fileToImport)
);

const getFsProto = (disk = true) => {
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

// TODO: clean this up
// while we should use both of these exports
// there are efficiencies to gain with the proxy API
export const fsProto = getFsProto(true);
export const memfsProto = getFsProto(false);

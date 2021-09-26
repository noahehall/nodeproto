import { fileURLToPath } from 'url';
import { fs as memfs } from 'memfs';

import esMain from './esmain';
import fse from 'fs-extra';
import path from 'path';

const r = (t, msg = 'is required') => { throw new Error(`${t}: ${msg}`); };

export const isMain = (
  requireMain, // will be undefined in esm
  importMeta,
) => {
  if (!requireMain && !importMeta) return false;

  return requireMain
    ? requireMain == module
    : esMain(importMeta);
}

export const parentUri = (importMeta) => (
  importMeta?.url
    ? fileURLToPath(importMeta.url)
    : module.filename
);

// TODO: breaks if --experimental-import-meta-resolve is set
export const resolve = async (
  fileToImport = r('fileToImport: string'),
  parent = parentUri(),
  importMeta
) => (importMeta?.resolve
  ? await importMeta.resolve(fileToImport, parent)
  : path.join(path.dirname(parent), fileToImport)
);

export const getFsproto = (disk = true) => {
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
export const fsproto = getFsproto(true);
export const memfsproto = getFsproto(false);

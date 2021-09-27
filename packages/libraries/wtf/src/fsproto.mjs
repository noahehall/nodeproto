import { fileURLToPath } from 'url';
import { fs as memfs } from 'memfs';
import { wtf as wtfShared } from '@nodeproto/shared';

import esMain from './esmain';
import fse from 'fs-extra';
import path from 'path';

const r = (t, msg = 'is required') => { throw new Error(`${t}: ${msg}`); };

export const isMain = (
  importMetaOrRequireMain = r('importMetaOrRequireMain'),
) => wtfShared.isEsm()
  ? esMain(importMetaOrRequireMain)
  : importMetaOrRequireMain == module; // eslint-disable-line no-undef


export const urlToPath = (importMetaUrlOrPath = r('importMetaUrlOrPath')) => fileURLToPath(importMetaUrlOrPath);


export const resolve = async (
  fileToImport = r('fileToImport: string'),
  importMetaOrPath = r('importMetaOrPath: import.meta | string')
) => {
  if (wtfShared.isEsm()) {
    if (!importMetaOrPath.resolve)
      throw new Error('import.meta required in esm: resolve(file, import.meta)');

    return urlToPath(await importMetaOrPath.resolve(fileToImport, importMetaOrPath.url));
  }

  // must be in cjs environtment
  return path.resolve(path.dirname(importMetaOrPath), fileToImport);
};

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
      } catch (e) {} finally { // eslint-disable-line no-empty
        return fs.writeFile.apply(fs, opts); // eslint-disable-line no-unsafe-finally
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
// we should import either or, not both
// there are efficiencies to gain with the proxy API
export const fsproto = getFsproto(true);
export const memfsproto = getFsproto(false);

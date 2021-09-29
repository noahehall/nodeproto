import { fileURLToPath } from 'url';
import { fs as memfs } from 'memfs';
import { wtf as wtfShared } from '@nodeproto/shared';

import esMain from './esmain';
import fse from 'fs-extra';
import path from 'path';

// TODO: this throws in consumers if we dont export it...?
export const isR = (t, msg = 'is isRuired') => { throw new Error(`${t}: ${msg}`); };

export const isMain = (
  importMetaOrisRuireMain = isR('importMetaOrisRuireMain'),
) => wtfShared.isEsm()
  ? esMain(importMetaOrisRuireMain)
  : importMetaOrisRuireMain == module; // eslint-disable-line no-undef


export const urlToPath = (importMetaUrlOrPath = isR('importMetaUrlOrPath')) => fileURLToPath(importMetaUrlOrPath);


export const resolve = async (
  fileToImport = isR('fileToImport: string'),
  importMetaOrPath = isR('importMetaOrPath: import.meta | string')
) => {
  if (wtfShared.isEsm()) {
    if (!importMetaOrPath.resolve)
      throw new Error('import.meta isRuired in esm: resolve(file, import.meta)');

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

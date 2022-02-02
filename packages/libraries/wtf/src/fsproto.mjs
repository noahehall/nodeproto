// @flow

import { isEsm, throwIt } from '@nodeproto/shared';
import { fileURLToPath } from 'url';
import { fs as memfs } from 'memfs';

import fse from 'fs-extra';
import path from 'path';

import { esMain } from './esmain';

import type {
  FileType,
  ImportMetaType,
  ObjectType,
} from '@nodeproto/configproto/libdefs';

export const isMain = (importMetaOrRequireMain: ObjectType): boolean =>
  isEsm() ? esMain(importMetaOrRequireMain.url) : importMetaOrRequireMain == module; // eslint-disable-line no-undef

export const urlToPath = (importMetaUrlOrPath: string): string => fileURLToPath(importMetaUrlOrPath);

export const resolve = async (
  relativeFilePath: string,
  importMetaOrPath: ImportMetaType | string,
): Promise<string | void> => {
  if (isEsm()) {
    if (typeof importMetaOrPath === 'string' || !importMetaOrPath.resolve || !importMetaOrPath.url)
      throwIt(
        'import.meta is required in esm: resolve(relativeFilePath, import.meta)' +
          '\nensure to run node with --experimental-import-meta-resolve' +
          '\n@see https://nodejs.org/api/esm.html#esm_import_meta_resolve_specifier_parent'
      );
    else {
      const absoluteFileUrl = await importMetaOrPath.resolve(
        relativeFilePath,
        importMetaOrPath.url
      ).catch(() => void 0);

      return absoluteFileUrl ? urlToPath(absoluteFileUrl) : undefined;
    }
  }

  if (typeof importMetaOrPath === 'string')
    return path.resolve(path.dirname(importMetaOrPath), relativeFilePath);

  throwIt('path is required in cjs: resolve(relativeFilePath, path)');
};

export const getFsproto = (disk: boolean = true): ObjectType => {
  const fs = disk ? fse : memfs;

  return {
    fs,
    readFile: fs.readFile,
    readFiles: async (files: FileType[]): Promise<Array<any>> => {
      return Promise.all(
        files.map(({ filename, encoding = 'utf8' }) => fs.readFile(filename, encoding))
      );
    },
    writeFile: async (...opts: any[]): Promise<void> => {
      try {
        await fs.ensureDir(path.dirname(opts[0]));
      } catch {} // eslint-disable-line no-empty

      return fs.writeFile.apply(fs, opts);
    },

    writeFiles: async (files: FileType[] = []): Promise<void | Error> => {
      Promise.all(
        files.map(({ filename, data, encoding = 'utf8' }) =>
          fs.writeFile(filename, data, { encoding })
        )
      ).catch((e) => e);
    }
  };
};

export const fsproto: ObjectType = getFsproto(true);
export const memfsproto: ObjectType = getFsproto(false);

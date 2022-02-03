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
  importMetaOrPath?: ImportMetaType | string,
): Promise<string | void> => {
  if (!relativeFilePath) throwIt('relativeFilePath is required');
  else if (!importMetaOrPath)
    return path.resolve(relativeFilePath);
  else if (typeof importMetaOrPath === 'string')
    return path.resolve(path.dirname(importMetaOrPath), relativeFilePath);
  else if (importMetaOrPath.resolve && importMetaOrPath.url)
      return importMetaOrPath
        .resolve(relativeFilePath, importMetaOrPath.url)
        .then(absoluteFileUrl => urlToPath(absoluteFileUrl))
        .catch(() => console.info(`could not resolve file: ${relativeFilePath}`));
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
    readFileSync: fs.readFileSync,
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

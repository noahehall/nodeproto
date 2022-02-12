// @flow

import { isBoolean, isEsm, isFunction, isString, throwIt } from '@nodeproto/shared';
import { fileURLToPath } from 'url';
import { fs as memfs } from 'memfs';

import fse from 'fs-extra';
import path from 'path';

import { esMain } from './esmain';

import type { FileType, FsprotoType, ImportMetaType, ObjectType } from './libdefs';

export const isMain = (importMetaOrRequireMain: ObjectType): boolean => {
  if (isEsm()) {
    return typeof importMetaOrRequireMain.url === 'string'
      ? esMain(importMetaOrRequireMain.url)
      : false;
  }

  return importMetaOrRequireMain == module; // eslint-disable-line no-undef
};

export const urlToPath = (importMetaUrlOrPath: string): string => fileURLToPath(importMetaUrlOrPath);

export const resolve = async (
  relativeFilePath: string,
  importMetaOrPath?: ImportMetaType & string & boolean, // bolean for confirming a relative path exists
  throwIfNotFound?: boolean = false,
): Promise<string | void> => {
  let absFilePath: string;

  if (!relativeFilePath) throwIt('relativeFilePath is required');
  else if (!importMetaOrPath || isBoolean(importMetaOrPath))
    absFilePath = path.resolve(relativeFilePath);
  else if (typeof importMetaOrPath === 'string')
    absFilePath = path.resolve(path.dirname(importMetaOrPath), relativeFilePath);
  else if (
    !isBoolean(importMetaOrPath)
    && isFunction(importMetaOrPath.resolve)
    && isString(importMetaOrPath.url)
  )
      absFilePath = await importMetaOrPath
        .resolve(relativeFilePath, importMetaOrPath.url)
        .then(absoluteFileUrl => urlToPath(absoluteFileUrl))
        .catch(() => '');

  if (
    (throwIfNotFound || isBoolean(importMetaOrPath) && importMetaOrPath)
    && (!absFilePath || !(await fse.pathExists(absFilePath))))
    throwIt(`${relativeFilePath} does not exist`);

  return absFilePath;
};

export const getFsproto = (disk: boolean = true): FsprotoType => {
  const fs = disk ? fse : memfs;

  return {
    fs,
    readFile: fs.readFile,
    readFiles: async (files) => Promise.all(
      files.map(({ filename, encoding = 'utf8' }) => fs.readFile(filename, encoding))
    ),
    readFileSync: fs.readFileSync,
    writeFile: async (outputPath, ...opts) => {
      try {
        await fs.ensureDir(path.dirname(outputPath)); // creates dir if missing
      } catch {} // eslint-disable-line no-empty

      // $FlowIssue[incompatible-type]
      return fs.writeFile.apply(fs, [outputPath].concat(opts));
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

export const fsproto: FsprotoType = getFsproto(true);
export const memfsproto: FsprotoType = getFsproto(false);

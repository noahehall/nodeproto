// @flow

import { isBoolean, isEsm, isFunction, isString, throwIt } from '@nodeproto/shared';
import { fileURLToPath } from 'url';
import { fs as memfs } from 'memfs';

import fse from 'fs-extra';
import path from 'path';

import { esMain } from './esmain';

import type { FileType, FsprotoType, ImportMetaType, ObjectType, ResolveInterface } from './libdefs';

export const isMain = (importMetaOrRequireMain: ObjectType): boolean => {
  if (isEsm()) {
    return typeof importMetaOrRequireMain.url === 'string'
      ? esMain(importMetaOrRequireMain.url)
      : false;
  }

  return importMetaOrRequireMain == module; // eslint-disable-line no-undef
};

export const urlToPath = (importMetaUrlOrPath: string): string => fileURLToPath(importMetaUrlOrPath);

export const resolve: ResolveInterface = async (
  relativeFilePath,
  importMetaOrPathOrBoolean, // bolean for confirming a relative path exists
  throwIfNotFound = false,
): Promise<string | void> => {
  let absFilePath: string;

  if (!relativeFilePath) return throwIt('relativeFilePath is required');
  if (!importMetaOrPathOrBoolean || isBoolean(importMetaOrPathOrBoolean))
    absFilePath = path.resolve(relativeFilePath);
  else if (typeof importMetaOrPathOrBoolean === 'string')
    absFilePath = path.resolve(path.dirname(importMetaOrPathOrBoolean), relativeFilePath);
  else if (
    !isBoolean(importMetaOrPathOrBoolean)
    && isFunction(importMetaOrPathOrBoolean.resolve)
    && isString(importMetaOrPathOrBoolean.url)
  )
      absFilePath = await importMetaOrPathOrBoolean
        .resolve(relativeFilePath, importMetaOrPathOrBoolean.url)
        .then(absoluteFileUrl => urlToPath(absoluteFileUrl))
        .catch(() => '');

  if (
    (throwIfNotFound || isBoolean(importMetaOrPathOrBoolean) && importMetaOrPathOrBoolean)
    && (!absFilePath || !(await fse.pathExists(absFilePath))))
    return throwIt(`${relativeFilePath} does not exist`);

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

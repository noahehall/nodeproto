// @flow

import typeof fs, { readFile, readFileSync } from 'fs-extra';

import { typeof wtf } from '@nodeproto/shared';

import type { FileType } from '@nodeproto/configproto/src/libdefs';

export type * from '@nodeproto/configproto/src/libdefs';

// TODO: check interface contract in test file and add additional annotations
export type DirsType = {
  ...wtf,
  inceptionStore: string,
  ...
}

export type ReadFilesType = (files: FileType[]) => Promise<string[]>;
export type WriteFileType = (outputPath: string, ...opts?: any[]) => Promise<void>;
export type WriteFilesType = (files: FileType[]) => Promise<void | Error>;

export type FsprotoType = {
  fs: fs,
  readFile: readFile,
  readFiles: ReadFilesType,
  readFileSync: readFileSync,
  writeFile: WriteFileType,
  writeFiles: WriteFilesType,
}

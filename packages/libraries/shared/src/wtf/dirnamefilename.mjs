// @flow

// @see https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-when-using-the-experimental-modules-flag

import { fileURLToPath } from "url";
import path from "path";

export const isEsm = (): boolean => typeof require === "undefined";
export const isCjs = (): boolean => !isEsm();

// absolute path to the current file
export const filename = (importMetaUrlOrPath: string): string =>
  isEsm()
    ? fileURLToPath(importMetaUrlOrPath)
    : path.resolve(importMetaUrlOrPath);

// absolute path to current module
export const dirname = (importMetaUrlOrPath: string): string =>
  isEsm()
    ? path.dirname(filename(importMetaUrlOrPath))
    : path.dirname(path.resolve(importMetaUrlOrPath));

// @flow

// @see https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-when-using-the-experimental-modules-flag
// dont duplicate this shit across your app, just use this, which should be part
// of your dependencies anyway

import { fileURLToPath } from "url";
import path from "path";

type BooleanFn = {
  (): boolean,
};
export const isEsm: BooleanFn = () => typeof require === "undefined";
export const isCjs: BooleanFn = () => !isEsm();

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

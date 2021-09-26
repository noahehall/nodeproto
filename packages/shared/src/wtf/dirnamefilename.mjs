import path from 'path';
import { fileURLToPath } from 'url';

export const isEsm = () => typeof require === 'undefined';

// @see https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-when-using-the-experimental-modules-flag
export const filename = (importMetaUrl) => isEsm()
  ? fileURLToPath(importMetaUrl)
  : __filename;
export const dirname = (importMetaUrl) => isEsm()
  ? path.dirname(filename(importMetaUrl))
  : __dirname;

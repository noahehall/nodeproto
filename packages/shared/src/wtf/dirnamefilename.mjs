import path from 'path';
import { fileURLToPath } from 'url';

const isCjs = typeof require === 'undefined';
export const filename = (importMetaUrl = import.meta?.url) => isCjs
  ? fileURLToPath(importMetaUrl)
  : __filename;
export const dirname = (importMetaUrl = import.meta?.url) => isCjs
  ? path.dirname(filename(importMetaUrl))
  : __dirname;

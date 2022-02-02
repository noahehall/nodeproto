// @flow

// @see https://github.com/tschaub/es-main/blob/main/main.js
// copypasta: it was such a simple package why import it?

import { fileURLToPath } from 'url';
import path from 'path';

import type { ObjectType } from '@nodeproto/configproto/libdefs';

export const stripExt = (name: string): string => {
  const extension = path.extname(name);

  return extension ? name.slice(0, -extension.length) : name;
}

export const esMain = (importMetaUrl: string): boolean => {
  const modulePath = fileURLToPath(importMetaUrl);
  const scriptPath = process.argv[1];

  const scriptExt = path.extname(scriptPath);

  return scriptExt ? (modulePath === scriptPath) : stripExt(modulePath) === scriptPath;
}

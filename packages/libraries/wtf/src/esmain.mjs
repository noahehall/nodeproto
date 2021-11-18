// @see https://github.com/tschaub/es-main/blob/main/main.js
// copypasta

import { fileURLToPath } from "url";

import path from "path";
import process from "process";

export function stripExt(name) {
  const extension = path.extname(name);
  if (!extension) {
    return name;
  }

  return name.slice(0, -extension.length);
}

export default function (meta) {
  const modulePath = fileURLToPath(meta.url);

  const scriptPath = process.argv[1];
  const extension = path.extname(scriptPath);
  if (extension) {
    return modulePath === scriptPath;
  }

  return stripExt(modulePath) === scriptPath;
}

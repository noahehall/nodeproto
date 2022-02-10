// @flow

import { logIt, noop, throwIt } from '@nodeproto/shared';

import { childPkgJsonPath, getFiles } from './getFiles';
import { syncFiles } from './syncFiles';

import fs from 'fs-extra';
import path from 'path';

import type { JsyncConfigType, JsyncMetaType, ObjectType } from './libdefs';

(async () => {
  const files = await getFiles();

  if (typeof files === 'undefined') return void 0;

  const { childJson , config, rootJson } = files;


  const newJsonFile = syncFiles({ childJson, config, rootJson });

  fs.outputJson(childPkgJsonPath + '/package.json', newJsonFile, { spaces: 2 });

  logIt('\n\n JSYNC complete:', newJsonFile);
})();

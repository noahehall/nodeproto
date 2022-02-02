// @flow

import { logIt, noop, throwIt } from '@nodeproto/shared';
import type { ObjectType } from '@nodeproto/shared';

import { childPkgJsonPath, getFiles } from './getFiles';
import { syncFiles } from './syncFiles';

import fs from 'fs-extra';
import path from 'path';

const { childJson, config, rootJson }: {
  childJson: ObjectType,
  config: ObjectType,
  rootJson: ObjectType,
  // flow/eslint errs on top-level await, not a blocker just an inconvenience
} = await getFiles(); // eslint-disable-line


const newJsonFile: ObjectType = syncFiles({
  childJson,
  config,
  rootJson,
});

fs.outputJson(childPkgJsonPath + '/package.json', newJsonFile, { spaces: 2 });

logIt('\n\n JSYNC complete:', newJsonFile);

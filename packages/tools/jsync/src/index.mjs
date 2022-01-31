// @flow

import {
  childPkgJson,
  childPkgJsonPath,
  diskPath,
  getJsyncConfig,
  getRootPkgJson,
} from './getFiles';

import { FORCE_VALUES, IGNORE_VALUES, SPREAD_VALUES } from './constants';
import { logIt, noop, throwIt } from '@nodeproto/shared';
import { segmentJsonFieldsByCategory, syncJsonFiles } from './syncFiles';

import fs from 'fs-extra';
import path from 'path';

const { DEFAULT_CATEGORY, ...defaultJsyncConfig } = getJsyncConfig();

// get jsync config from parent json file
const {
  json: { jsync: rootJsyncConfig, ...rootJson },
} = await getRootPkgJson({
  maxLookups: defaultJsyncConfig.maxLookups,
  currentDir: path.resolve(diskPath, '..'), // start in parent dir
});

// get fieldCategories for the rootJson file and the jsync config
const { fieldCategories, jsyncFieldCategories } = segmentJsonFieldsByCategory({
  defaultJsyncConfig,
  fieldNames: Object.keys(rootJson),
  rootJsyncConfig,
});

const newJsonFile = syncJsonFiles({
  childPkgJson,
  defaultFieldCategory: DEFAULT_CATEGORY,
  fieldCategories,
  jsyncFieldCategories,
  rootJson,
});

fs.outputJson(childPkgJsonPath + '/package.json', newJsonFile, { spaces: 2 });

logIt('\n\n JSYNC complete:', newJsonFile);

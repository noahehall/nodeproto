import * as t from '@nodeproto/testproto/t';

import {
  createCacheGroups,
  createOptimization,
  createSplitChunks,
  createTerserPlugin,
  generateLoaders,
  getAssetLoaders,
  getCache,
  getDefaultPlugins,
  getStringReplaceLoader,
  getWebpackExperiments,
} from '@nodeproto/buildproto';

const { assert } = t;

const test = t.suite('utility.webpack.config');

test('createCachegroups', () => {
  const cacheGroups = createCacheGroups();

  assert.isObject(cacheGroups);
  assert.hasAllKeys(cacheGroups, ['babel', 'default', 'etc', 'react', 'styled', 'support']);
});

test('createSplitChunks', () => {
  const splitChunks = createSplitChunks();

  assert.isObject(splitChunks);
  assert.hasAllKeys(splitChunks, [
    'cacheGroups',
    'chunks',
    'enforceSizeThreshold',
    'maxAsyncRequests',
    'maxAsyncSize',
    'maxInitialRequests',
    'maxInitialSize',
    'maxSize',
    'minChunks',
    'minRemainingSize',
    'minSize',
    'name',
    'usedExports',
  ]);
});

test('createOptimization', () => {
  const optimization = createOptimization();

  assert.isObject(optimization);
  assert.hasAllKeys(optimization, [
    'chunkIds',
    'concatenateModules',
    'emitOnErrors',
    'flagIncludedChunks',
    'innerGraph',
    'mangleExports',
    'mergeDuplicateChunks',
    'minimize',
    'minimizer',
    'moduleIds',
    'nodeEnv',
    'portableRecords',
    'providedExports',
    'realContentHash',
    'removeAvailableModules',
    'removeEmptyChunks',
    'runtimeChunk',
    'sideEffects',
    'splitChunks',
    'usedExports',
  ]);
});

test('createTerserPlugin', () => {
  const terserPlugin = createTerserPlugin('some path', true)[0]();

  assert.isObject(terserPlugin);
  assert.hasAllKeys(terserPlugin, [
    'extractComments',
    'include',
    'parallel',
    'terserOptions',
    'test',
  ]);
});

test.run();

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
  getInfrastructureLogging,
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

test('getDefaultPlugins', () => {
  const plugins = getDefaultPlugins();

  assert.isArray(plugins);
});

test('getAssetLoaders', () => {
  const loaders = getAssetLoaders();

  assert.isObject(loaders);
  assert.hasAllKeys(loaders, ['fontLoader', 'imageLoader', 'svgLoader', 'videoLoader']);
});

test('generateLoaders', () => {
  const loaders = generateLoaders();

  assert.isArray(loaders);
  loaders.forEach((loader) => {
    assert.isObject(loader);
    assert.hasAnyKeys(loader, ['test']);
  });
});

test('getCache', () => {
  assert.isFalse(getCache());
  assert.hasAllKeys(getCache(true, { pkgJson: { name: 'test', version: '1 ' } }), [
    'allowCollectingMemory',
    'compression',
    'hashAlgorithm',
    'idleTimeout',
    'idleTimeoutAfterLargeChanges',
    'idleTimeoutForInitialStore',
    'maxAge',
    'maxMemoryGenerations',
    'memoryCacheUnaffected',
    'name',
    'profile',
    'store',
    'type',
    'version',
  ]);

  const fakeCacheObject = { some: 'cache', object: 'i want to use' };
  assert.deepEqual(getCache(fakeCacheObject), fakeCacheObject);
});

test('getStringReplaceLoader', () => {
  const loader = getStringReplaceLoader('some string');

  assert.isObject(loader);
  assert.hasAllKeys(loader, ['loader', 'options']);
});

test('getWebpackExperiments', () => {
  const experiments = getWebpackExperiments();

  assert.isObject(experiments);
  assert.hasAllKeys(experiments, [
    'asyncWebAssembly',
    'cacheUnaffected',
    'layers',
    'lazyCompilation',
    'outputModule',
    'syncWebAssembly',
    'topLevelAwait',
  ]);
});

test('getInfrastructureLogging', () => {
  const logging = getInfrastructureLogging();

  assert.isObject(logging);
  assert.hasAllKeys(logging, ['level']);
});

test.run();

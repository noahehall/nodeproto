import * as t from '@nodeproto/testproto/t';

import {
  combineArrays,
  createCacheGroups,
  createOptimization,
  createSplitChunks,
  createTerserPlugin,
  generateBasePlugins,
  generateLoaders,
  getAssetLoaders,
  getCache,
  getDefaultPlugins,
  getHtmlWebpackPlugin,
  getInfrastructureLogging,
  getStringReplaceLoader,
  getWebpackExperiments,
} from '@nodeproto/buildproto';

const { assert } = t;

const test = t.suite('utility.webpack.config');

test('createCachegroups', () => {
  const cacheGroups = createCacheGroups();

  assert.isObject(cacheGroups);
  assert.hasAllKeys(cacheGroups, ['babel', 'default', 'etc', 'koa', 'react', 'styles']);
});

test('createSplitChunks', () => {
  const splitChunks = createSplitChunks();

  assert.isObject(splitChunks);
  assert.hasAllKeys(splitChunks, [
    'automaticNameDelimiter',
    'cacheGroups',
    'chunks',
    'enforceSizeThreshold',
    'hidePathInfo',
    'maxAsyncRequests',
    'maxInitialRequests',
    'maxSize',
    'minChunks',
    'minRemainingSize',
    'minSize',
    'minSizeReduction',
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
    'mangleWasmImports',
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
  const terserPlugin = createTerserPlugin('some path', true)[0];

  assert.isObject(terserPlugin);
  assert.hasAllKeys(terserPlugin.options, [
    'exclude',
    'extractComments',
    'include',
    'minimizer',
    'parallel',
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
  const experiments = getWebpackExperiments({});

  assert.isObject(experiments);
  assert.hasAllKeys(experiments, [
    'cacheUnaffected',
    'layers',
    'lazyCompilation',
    'outputModule',
    'topLevelAwait',
  ]);
});

test('getInfrastructureLogging', () => {
  const logging = getInfrastructureLogging();

  assert.isObject(logging);
  assert.hasAllKeys(logging, ['level']);
});

test('combineArrays', () => {
  const startArray = [1, 2, 3];
  const baseArray = [4, 5, 6];
  const endArray = [7, 8, 9];

  const combined = combineArrays(baseArray, startArray, endArray);

  assert.isArray(combined);
  assert.deepEqual(combined, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('getHtmlWebpackPlugin', () => {
  const htmlWebpackPlugin = getHtmlWebpackPlugin();

  const expectedContract = {
    userOptions: { inject: true },
    version: 5,
  };

  assert.isArray(htmlWebpackPlugin);
  assert.isObject(htmlWebpackPlugin[0]);
  assert.deepEqual(htmlWebpackPlugin[0], expectedContract);

  const multipleHtmlFiles = getHtmlWebpackPlugin(Array(5).fill({}));

  assert.isArray(htmlWebpackPlugin);

  multipleHtmlFiles.forEach((htmlPlugin) => {
    assert.isObject(htmlPlugin);
    assert.deepEqual(htmlPlugin, expectedContract);
  });
});

test('generateBasePlugins', () => {
  const plugins = generateBasePlugins();

  assert.isArray(plugins);
  plugins.forEach((plugin) => assert.isObject(plugin));

  const pluginsToPush = [{}, {}];
  const withPlugins = generateBasePlugins({}, pluginsToPush);

  withPlugins.forEach((plugin) => assert.isObject(plugin));
  assert.equal(withPlugins.length - plugins.length, pluginsToPush.length);
});

test.run();

// getting unsupported_dir_import on /src/esbuild via apps/authnz
import * as t from '@nodeproto/testproto/t';

import * as buildproto from '@nodeproto/buildproto';

const { assert } = t;

const test = t.suite('@nodeproto/buildproto/buildproto');

test('@nodeproto/buildproto', () => {
  // TODO: some of these arent appropriate exports
  // ^ and arent appropriatedly named
  assert.hasAllKeys(buildproto, [
    'EsbuildPluginPopCopy',
    'baseEsbuildConfig',
    'baseWebpackConfig',
    'buildWebpackConfig',
    'combineArrays',
    'compilerCallback',
    'createCacheGroups',
    'createOptimization',
    'createSplitChunks',
    'createTerserPlugin',
    'esbuildCompileConfig',
    'esbuildRunConfig',
    'generateBasePlugins',
    'generateLoaders',
    'getAssetLoaders',
    'getCache',
    'getDefaultPlugins',
    'getHtmlWebpackPlugin',
    'getInfrastructureLogging',
    'getStringReplaceLoader',
    'getWebpackExperiments',
    'handleCompileIssues',
    'handleConfigErrors',
    'logResults',
    'pack',
    'reactWebpackConfig',
    'startDev',
    'stopDev',
    'testCompiler',
    'webpackServer',
  ]);
});

test.run();

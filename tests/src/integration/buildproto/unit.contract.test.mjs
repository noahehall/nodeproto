import * as t from '@nodeproto/testproto';

const { assert } = t;

const test = t.suite('integration:buildproto:esm:apiContract');

test('imports', async () => {
  const buildprotoExpected = [
    'FlowTypeCleaner',
    'baseWebpackConfig',
    'buildWebpackConfig',
    'cache',
    'createEsbuildConfig',
    'esbuildConfig',
    'esbuildPluginPopCopy',
    'esbuildPluginPopCopyConfig',
    'esrunConfig',
    'fileCopy',
    'fileShouldCopy',
    'filesToCopy',
    'reactDevWebpackConfig',
    'reactEsbuildWebpackConfig',
    'serverWebpack',
    'setupWebpackConfig',
    'stopDev',
  ];

  assert.hasAllKeys(
    await import('@nodeproto/buildproto'),
    buildprotoExpected
  );
  // TODO: only testing the default import
});

test.run();

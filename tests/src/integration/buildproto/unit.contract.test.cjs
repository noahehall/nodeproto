const t = require('@nodeproto/testproto');

const { assert } = t;

const test = t.suite('integration:wtf:buildproto:apiContract');

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
    require('@nodeproto/buildproto'),
    buildprotoExpected
  );
});

test.run();

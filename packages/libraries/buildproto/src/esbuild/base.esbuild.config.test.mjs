import * as t from '@nodeproto/testproto/t';

import { baseEsbuildConfig } from '@nodeproto/buildproto';

const { assert } = t;

const test = t.suite('create.esbuild.config');

test.before.each((context) => {
  const baseEsbuildOptions = {
    entry: './src/fixtures/esm.mjs',
  };

  context.fixtures = {
    baseEsbuildOptions,
  };
});

test.after.each((context) => {
  delete context.fixtures;
});

test('baseEsbuildConfig', async ({ fixtures }) => {
  baseEsbuildConfig({ entry: /must be a string/ })
    .then(() => assert.fail('should not resolve'))
    .catch((e) => assert.match(e.message, /entry/));

  const { baseEsbuildOptions } = fixtures;
  const esbuildConfig = await baseEsbuildConfig(baseEsbuildOptions);

  assert.isObject(esbuildConfig, 'returns esbuild config object');

  assert.hasAllKeys(esbuildConfig, [
    'assetNames',
    'bundle',
    'define',
    'entryNames',
    'entryPoints',
    'external',
    'metafile',
    'minify',
    'outdir',
    'platform',
    'plugins',
    'preserveSymlinks',
    'resolveExtensions',
    'sourcemap',
    'target',
    'watch',
    'write',
  ]);
});

test.run();

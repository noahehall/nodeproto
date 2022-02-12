import * as t from '@nodeproto/testproto/t';

import { baseEsbuildConfig } from '@nodeproto/buildproto';

import { getPackInterface } from '../pack.test.mjs';

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
  const { config, pack } = await baseEsbuildConfig(baseEsbuildOptions);

  assert.isObject(config, 'returns esbuild config object');

  assert.hasAllKeys(config, [
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

  assert.isObject(pack, 'returns pack object');
  assert.hasAllKeys(pack, getPackInterface());
});

test.run();

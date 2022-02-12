import * as t from '@nodeproto/testproto/t';

import { baseEsbuildConfig, esbuildCompileConfig, esbuildRunConfig } from '@nodeproto/buildproto';

import { getPackInterface } from '../pack.test.mjs';

const { assert } = t;

const test = t.suite('run.esbuild.config');

test('esbuildCompileConfig', async () => {
  const entryPoints = [
    './src/fixtures/auto.js',
    // './src/fixtures/commonjs.cjs', // not really supporting cjs at this time
    './src/fixtures/esm.mjs',
  ];

  for (const entry of entryPoints) {
    const { config, pack } = await baseEsbuildConfig({ entry, write: false });
    const results = await esbuildCompileConfig(config);

    assert.hasAllKeys(
      results,
      ['errors', 'metafile', 'outputFiles', 'warnings'],
      `compiles ${entry.split('.').pop()} files`
    );

    assert.lengthOf(results.errors, 0);
    assert.lengthOf(results.warnings, 0);
    assert.lengthOf(results.outputFiles, 3);
    assert.hasAllKeys(results.metafile, ['inputs', 'outputs']);
  }
});

// TODO: esbuildRunConfig
test.run();

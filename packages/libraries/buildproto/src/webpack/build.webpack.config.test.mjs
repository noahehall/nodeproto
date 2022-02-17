import * as t from '@nodeproto/testproto/t';
import path from 'node:path';

import { baseWebpackConfig, buildWebpackConfig, testCompiler } from '@nodeproto/buildproto';

const { assert } = t;

// TODO: build.webpack.config.mjs has more fn thats not tested
const test = t.suite('build.webpack.config');

test.before.each((context) => {
  const baseWebpackOptions = {
    entry: ['./src/fixtures/esm.mjs'],
  };

  const copyOptions = {
    patterns: [
      {
        context: path.resolve('./src'),
        from: './**/*.(json|png)',
        to: path.resolve('./dist'),
      },
    ],
  };

  context.fixtures = {
    baseWebpackOptions,
    withCopyOptions: Object.assign({}, baseWebpackOptions, { copyOptions }),
  };
});

test.after.each((context) => {
  delete context.fixtures;
});

test('buildWebpackConfig', async ({ fixtures }) => {
  const { baseWebpackOptions } = fixtures;

  const { config, pack } = await baseWebpackConfig(baseWebpackOptions);

  assert.doesNotThrow(() => buildWebpackConfig(config, false), /errors/, 'bundles without errors');
});

test('buildWebpackConfig: witCopyOptions', async ({ fixtures }) => {
  const { withCopyOptions } = fixtures;

  const { config, pack } = await baseWebpackConfig(withCopyOptions);

  assert.doesNotThrow(() => buildWebpackConfig(config, false), /errors/, 'bundles without errors');
});

test.run();

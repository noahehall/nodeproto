import * as t from '@nodeproto/testproto/t';
import path from 'node:path';

import { baseWebpackConfig, buildWebpackConfig, testCompiler } from '@nodeproto/buildproto';

const { assert } = t;

const test = t.suite('build.webpack.config');

test.before.each((context) => {
  const baseWebpackOptions = {
    entry: ['poop/fixtures/esm.mjs'],
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
    copyOptions,
  };
});

test.after.each((context) => {
  delete context.fixtures;
});

test('buildWebpackConfig', async ({ fixtures }) => {
  const { baseWebpackOptions, copyOptions } = fixtures;

  const { config, pack } = await baseWebpackConfig(baseWebpackOptions);

  assert.isObject(await buildWebpackConfig(baseWebpackConfig(config), true), 'compiles to memfs');
});

test.run();

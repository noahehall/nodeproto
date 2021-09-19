import { getConfig } from './base.webpack.config.test.mjs';

import baseWebpackConfig from './base.webpack.config.mjs';
import buildWebpackConfig from './build.webpack.config.mjs';
import t from '#t';

const { assert } = t;

const test = t.suite('build.webpack.config.mjs');

test('compilation', async () => {
  const useConfig = getConfig();

  assert.isObject(
    await buildWebpackConfig(baseWebpackConfig(useConfig), false),
    'compiles with testCompiler if requested  '
  );
});

test.run();

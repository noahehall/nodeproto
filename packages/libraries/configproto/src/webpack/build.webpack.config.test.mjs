import { getConfig } from './base.webpack.config.test';

import baseWebpackConfig from './base.webpack.config';
import buildWebpackConfig from './build.webpack.config';
import t from '#t';

const { assert } = t;

const test = t.suite('build.webpack.config');

test('compilation', async () => {
  const useConfig = getConfig();

  assert.isObject(
    await buildWebpackConfig(baseWebpackConfig(useConfig), false),
    'compiles with testCompiler if requested  '
  );
});

test.run();

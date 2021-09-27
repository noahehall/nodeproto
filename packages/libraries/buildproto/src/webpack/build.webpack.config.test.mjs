import { getConfig } from './base.webpack.config.test';
import * as t from '@nodeproto/testproto';

import baseWebpackConfig from './base.webpack.config';
import buildWebpackConfig from './build.webpack.config';

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
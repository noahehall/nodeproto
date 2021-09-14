import { getConfig } from './base.webpack.config.test.mjs';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import baseWebpackConfig from './base.webpack.config.mjs';
import buildWebpackConfig from './build.webpack.config.mjs';

const test = suite('build.webpack.config.mjs');

test('compilation', async () => {
  const useConfig = getConfig();

  assert.type(
    await buildWebpackConfig(baseWebpackConfig(useConfig), false),
    'object',
    'compiles with testCompiler if requested  '
  );
});

// help determining what error is
test.skip('throws', () => {
  // this should throw and reveal error in console
  assert.ok(
    buildWebpackConfig({ pkgJsonPath: './doesnt.exist.here.json' })
  );
});

test.run();

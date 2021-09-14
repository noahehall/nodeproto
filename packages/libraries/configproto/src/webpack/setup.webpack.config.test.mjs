import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import setupWebpackConfig from './setup.webpack.config.mjs';

const test = suite('setup.webpack.config.mjs');

test('throws', () => {
  assert.throws(
    () => setupWebpackConfig({ pkgJsonPath: './doesnt.exist.here.json' }),
    /no such file or directory/,
    'if incorrect pkgJsonPath'
  );
});

test('is okay', () => {
  const { pack, config } = setupWebpackConfig();

  assert.type(
    config,
    'object',
    'returns config object suitable for a webpack compilation'
  );

  assert.type(
    pack,
    'object',
    'returns pack object with environment data & fns'
  );
});

// help determining what error is
test.skip('throws', () => {
  // this should throw and reveal error in console
  assert.ok(
    setupWebpackConfig({ pkgJsonPath: './doesnt.exist.here.json' })
  );
});

test.run();

import setupWebpackConfig from './setup.webpack.config';
import * as t from '@nodeproto/testproto';

const { assert } = t;

const test = t.suite('setup.webpack.config');

test('throws', () => {
  assert.throws(
    () => setupWebpackConfig({ pkgJsonPath: './doesnt.exist.here.json' }),
    /no such file or directory/,
    'if incorrect pkgJsonPath'
  );
});

test('is okay', () => {
  const { pack, config } = setupWebpackConfig();

  assert.isObject(
    config,
    'returns config object suitable for a webpack compilation'
  );

  assert.isObject(
    pack,
    'returns pack object with environment data & fns'
  );
});

test.run();

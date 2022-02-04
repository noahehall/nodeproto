import * as t from '@nodeproto/testproto/t';

import { setupWebpackConfig } from '@nodeproto/buildproto';

const { assert } = t;

const test = t.suite('setup.webpack.config');

test('setupWebpackConfig', async () => {
  setupWebpackConfig({ context: './not/abs/path' })
    .then(() => assert.fail('should not resolve'))
    .catch((e) => assert.equal(e.message, 'dirpath must be absolute'));

  setupWebpackConfig({ context: '/dir/without/package/json' })
    .then(() => assert.fail('should not resolve'))
    .catch((e) => assert.match(e.message, /could not find package.json/));

  const fakeSrc = 'fake/src/path';
  const fakeDist = 'fake/dist/path';

  setupWebpackConfig({ PATH_SRC: fakeSrc, PATH_DIST: process.cwd() })
    .then(() => assert.fail('should not resolve'))
    .catch((e) => assert.match(e.message, fakeSrc));

  setupWebpackConfig({ PATH_SRC: process.cwd(), PATH_DIST: fakeDist })
    .then(() => assert.fail('should not resolve'))
    .catch((e) => assert.match(e.message, fakeDist));

  const { pack, config } = await setupWebpackConfig();

  assert.isObject(config, 'returns webpack config');
  assert.isObject(pack, 'returns pack object with environment data & fns');

  assert.hasAllKeys(
    config,
    ['context', 'experiments', 'infrastructureLogging', 'mode', 'optimization'],
    'webpack config options related to webpack runtime env'
  );

  assert.hasAllKeys(
    pack,
    ['builtinModules', 'ifDev', 'ifProd', 'pathDist', 'pathSrc', 'pkgJson'],
    'buildproto pack meta object'
  );
});

test.run();

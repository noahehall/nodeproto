import * as t from '@nodeproto/testproto/t';

import { setupWebpackConfig } from '@nodeproto/buildproto';

const { assert } = t;

const test = t.suite('setup.webpack.config');

test('setupWebpackConfig', async () => {
  setupWebpackConfig({ context: './not/abs/path' }).catch((e) => {
    assert.equal(e.message, 'dirpath must be absolute');
  });

  setupWebpackConfig({ context: '/dir/without/package/json' }).catch((e) => {
    assert.match(e.message, /could not find package.json/);
  });

  const { pack, config } = await setupWebpackConfig();

  assert.isObject(config, 'returns webpack config');

  assert.isObject(pack, 'returns pack object with environment data & fns');
});

test.run();

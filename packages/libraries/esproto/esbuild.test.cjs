
const { envproto, esproto } = require('@nodeproto/utils')
const { test } = require('purple-tape');
const wrapper = require('@nodeproto/utils');

test(
  'cjs: can require default',
  t => {
    t.deepLooseEqual(
      Object.keys(wrapper),
      [
        'default',
        'envproto',
        'esproto',
      ]
    );
  }
);

test(
  'cjs: can destructure require',
  t => {
    t.deepLooseEqual(
      Object.keys({ ...envproto, ...esproto}),
      Object.keys({ ...wrapper.envproto, ...wrapper.esproto})
    )
  }
)

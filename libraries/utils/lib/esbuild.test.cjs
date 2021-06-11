
const { envproto, fsproto, esproto } = require('@nodeproto/utils')
const { test } = require('purple-tape');
const wrapper = require('@nodeproto/utils');

test('cjs: can require default', t => {
  t.deepLooseEqual(Object.keys(wrapper), ['default', 'envproto', 'esproto', 'fsproto']);
});

test('cjs: can destructure require', t => {
  t.deepLooseEqual(Object.keys({ ...envproto, ...esproto, ...fsproto }), Object.keys(Object.assign({}, wrapper.envproto, wrapper.esproto, wrapper.fsproto )))
})

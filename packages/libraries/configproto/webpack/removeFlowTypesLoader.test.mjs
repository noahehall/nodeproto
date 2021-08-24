// import implementation from 'esbuild';
// import * as flowFixtures from './fixtures/flow.mjs';
import { fileURLToPath } from 'url';
import FlowRMTLoader from './removeFlowTypesLoader.mjs';
import implementation from 'esbuild';
import path from 'path';
import t from 'tap';
import tapromise from 'tapromise';
import testCompiler, { createConfig } from './test.compiler.mjs';

const instance = new FlowRMTLoader(`
  // @flow
  const poop: string = 'flush';
`);

// @see https://node-tap.org/docs/api/mochalike/
t.mochaGlobals();

// @see https://webpack.js.org/contribute/writing-a-loader/#absolute-paths
// dont use absolute paths as it breaks hashing
const config = {
  context: path.dirname(fileURLToPath(import.meta.url)),
  entry: './fixtures/flow.mjs',
  module: {
    rules: [
      {
        test: /\.mjs$/,
        use: {
          loader: './fixtures/fakeLoader.cjs',
          options: {
            /* ... */
          },
        },
      },
      {
        test: /\.mjs$/,
        use: {
          loader: './fixtures/fakeLoader.mjs',
          options: {
            /* ... */
          },
        },
      },
      {
        test: /\.mjs$/,
        use: {
          loader: './removeFlowTypesLoader.mjs',
          // options: {
            /* ... */
          // },
        },
      },
      {
        test: /\.jsx$/,
        use: [
          {
              loader: 'esbuild-loader',
              options: {
                implementation,
                loader: 'jsx',
                target: 'es2015',
              },
            },
          {
            loader: FlowRMTLoader,
            options: {
              /* ... */
            },
          },
        ],
      },
    ],
  },
};

const r = (thing, msg = 'is required') => { throw new Error(`${thing} ${msg}`); };

const getConfig = (i = r('index')) => ({
  ...config,
  module: {
    ...config.module,
    rules: [config.module.rules[i]],
  },
});

t.test('removeFlowTypesLoader', t => {
  t.test('implementation', t => {
    const result = instance();

    t.ok(FlowRMTLoader, 'FlowRMTLoader exists');
    t.equal(typeof instance(), 'string', 'should return a string');
    t.equal(result.includes('@flow'), false, 'should remove string @flow');
    t.equal(result.includes(': string'), false, 'should remove string type');

    t.end();
  });

  t.test('integration', t => {
    t = tapromise(t);

    return Promise.all([
      t.ok(createConfig(config), 'creates config'),
      t.ok(testCompiler(getConfig(0)), 'sanity check with external cjs loader'),
      t.ok(testCompiler(getConfig(1)), 'sanity check with external mjs loader'),
    ]);
  });

  t.end();
});

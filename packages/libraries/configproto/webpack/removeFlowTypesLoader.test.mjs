import implementation from 'esbuild';
import path from 'path';
import t from 'tap';
// import testCompiler from './test.compiler.mjs';
import FlowRMTLoader from './removeFlowTypesLoader.mjs';

const instance = new FlowRMTLoader(`
  // @flow
  const poop: string = 'flush';
`);

t.test('removeFlowTypesLoader', t => {
  t.ok(FlowRMTLoader, 'FlowRMTLoader exists');
  t.equal(typeof instance(), 'string', 'should return a string');

  t.end();
});

// t.pass(true);

export default {
  module: {
    rules: [
      {
        test: /\.mjs$/,
        use: [
          {
            loader: path.resolve('./removeFlowTypesLoader.mjs'),
            options: {
              /* ... */
            },
          },
        ],
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
            loader: path.resolve('./removeFlowTypesLoader.mjs'),
            options: {
              /* ... */
            },
          },
        ],
      },
    ],
  },
};

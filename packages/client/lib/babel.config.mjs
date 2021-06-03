'use strict';

const corejs = {
  version: 3.4,
  proposals: true,
};

export default function (api) {
  // api.cache(true);
  const presets = [
    [
      // @see https://github.com/zloirock/core-js#babelpreset-env
      '@babel/preset-env',
      {
        targets: {
          browsers: 'last 2 versions, > 5%'
        },
        // import corejs polyfils as used by each file
        useBuiltIns: 'usage',
        // enable
        corejs,
        debug: true,
        modules: 'commonjs',
      }
    ],
    '@babel/preset-react',
  ];
  const plugins = [
    ['babel-plugin-styled-components', {
      minify: false,
      srr: false,
      transpileTemplateLiterals: false,
      displayName: true,
      fileName: true,
      pure: false,
    }],
    // '@babel/transform-runtime',
    'tailcall-optimization',
    [
      '@babel/plugin-proposal-decorators',
      {
        decoratorsBeforeExport: true,
      }
    ],
    // 'lodash',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-transform-react-jsx-source',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-private-methods',
    '@babel/plugin-proposal-throw-expressions',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-transform-react-constant-elements',
    '@babel/plugin-transform-react-inline-elements',
    '@babel/plugin-proposal-optional-catch-binding',
    '@babel/syntax-export-extensions',
  ];

  return {
    presets,
    plugins
  }
}

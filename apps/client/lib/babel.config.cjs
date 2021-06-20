/**
 * babel/preset-react
 * + includes:
 * ++ plugin-syntax-jsx,
 * ++ plugin-transform-react-jsx
 * ++ plugin-transform-react-display-name
 * ++ plugin-transofrm-react-jsx-self
 * ++ plugin-transform-react-jsx-source
 *
 * we use core-js with transform runtime
 * + so dont include any polyfills/proposals/shit for ecmastandard as they are included automatically if you use it
 */

const pkgJson = require('../package.json')
const  { envproto } = require('@nodeproto/utils');

const corejs = {
  version: 3, // throws error? pkgJson.dependencies['core-js'], @see fossissues.md for link to issue
  proposals: true,
};

const env = envproto.syncEnvAndConfig(pkgJson);

const isProd = process.env.NODE_ENV === 'production';


module.exports = function (api) {
  api?.cache(() => isProd);

  // @see https://babeljs.io/docs/en/assumptions
  const assumptions = {
    arrayLikeIsIterable: true,
    constantReexports: isProd, // might change due to module.hot?
    constantSuper: true,
    enumerableModuleMeta: true,
    ignoreFunctionLength: true,
    ignoreToPrimitiveHint: true,
    iterableIsArray: false,
    mutableTemplateObject: false,
    noClassCalls: true,
    noDocumentAll: true,
    noNewArrows: true,
    objectRestNoSymbols: true,
    privateFieldsAsProperties: !isProd,
    pureGetters: true,
    setClassMethods: false,
    setComputedProperties: false,
    setPublicClassFields: false,
    setSpreadProperties: false,
    skipForOfIteratorClosing: true,
    superIsCallableConstructor: true,
  };

  const presets = [
    // [ // todo: @see https://github.com/babel/preset-modules
    //   '@babel/preset-modules',
    //   {
    //     loose: true
    //   },

    // ],

    [
      // @see https://github.com/zloirock/core-js#babelpreset-env
      '@babel/preset-env',
      {
        targets: {
          browsers: 'last 2 versions, > 5%'
        },
        // import corejs polyfils as used by each file
        useBuiltIns: 'usage',
        bugfixes: true,
        // enable
        corejs,
        modules: false, // rely on webpack for treeshaking which needs this
        debug: !isProd,
      }
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'classic',
        development: !isProd
      }
    ],
  ].filter(e => e);

  const plugins = [
    [
      '@babel/plugin-transform-runtime',
      {
        absoluteRuntime: false,
        corejs,
        helpers: true,
        regenerator: true,
        version: pkgJson.dependencies['@babel/runtime-corejs3']
      }
    ],
    [
      'babel-plugin-styled-components',
      {
        displayName: !isProd,
        fileName: !isProd,
        minify: isProd,
        namespace: 'nirv',
        pure: isProd,
        srr: false,
        transpileTemplateLiterals: isProd,
      }
    ],
    'tailcall-optimization',

    // dont need any of this shit because we use corejs
    // keeping this here tho just in case
    // '@babel/plugin-proposal-class-properties',
    // '@babel/plugin-proposal-export-default-from',
    // '@babel/plugin-proposal-nullish-coalescing-operator',
    // '@babel/plugin-proposal-optional-catch-binding',
    // '@babel/plugin-proposal-optional-chaining',
    // '@babel/plugin-proposal-private-methods',
    // '@babel/plugin-proposal-throw-expressions',
    // '@babel/plugin-syntax-dynamic-import',
    // '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-transform-react-constant-elements',
    isProd && '@babel/plugin-transform-react-inline-elements',
    // [ disabled for treeshaking via webpack
    //   '@babel/plugin-transform-modules-commonjs',
    //   {
    //     importInterop: 'babel'
    //   }
    // ],
  ].filter(e => e);

  return {
    assumptions,
    presets,
    plugins,
  }
}

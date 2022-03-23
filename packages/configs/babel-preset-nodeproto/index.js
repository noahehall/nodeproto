module.exports = function (babel, options) {
  const isNode = options.platform === 'node';
  const isClient = !isNode;

  return {
    // simple options
    highlightCode: true,
    sourceMaps: true,
    sourceType: 'module',
    // complex options
    // @see https://babeljs.io/docs/en/assumptions
    assumptions: {
      // arrayLikeIsIterable: true,
      constantReexports: true,
      constantSuper: true,
      enumerableModuleMeta: true,
      ignoreFunctionLength: true,
      ignoreToPrimitiveHint: true,
      iterableIsArray: true, // we heavily use maps & sets
      mutableTemplateObject: true,
      noClassCalls: true,
      noDocumentAll: true,
      noIncompleteNsImportDetection: true,
      noNewArrows: true,
      objectRestNoSymbols: true,
      privateFieldsAsProperties: true,
      pureGetters: true,
      setClassMethods: true,
      setComputedProperties: true,
      setPublicClassFields: true,
      setSpreadProperties: true,
      skipForOfIteratorClosing: true,
      superIsCallableConstructor: true, // disallow extending native classes
    },
    env: {
      production: {
        highlightCode: false,
        minified: true, // includes compact: true
        comments: false,
      },
    },
    generatorOpts: {
      comments: true,
      compact: false,
      minified: false,
      retainLines: false,
      // never enable these; use a plugin instead
      // "auxiliaryCommentBefore"
      // auxiliaryCommentAfter
      // shouldPrintComment
    },
    overrides: [
      {
        // all commonjs options
        test: '**/*.cjs$',
        // This option will not affect parsing of .mjs files, as they are currently hard-coded to always parse as "module" files.
        sourceType: 'script',
      },
      {
        test: ['**/*.mjs$', '**/*.jsx$'],
        sourceType: 'module',
      },
      {
        // interprets as module if import/export exists
        test: '**/*.js$',
        sourceType: 'unambiguous',
      },
    ],
    // https://babel.dev/docs/en/babel-parser#options
    parserOpts: {
      // "sourceType": "unambiguous",
      // attachComment: false, // let babel/eslint-parser handle this
      allowAwaitOutsideFunction: false, // use topLevelAwait plugin instead
      allowImportExportEverywhere: false,
      allowReturnOutsideFunction: false,
      allowSuperOutsideMethod: false,
      allowUndeclaredExports: true,
      errorRecovery: false,
      strict: true,
      // @see https://babel.dev/docs/en/babel-parser#plugins
      // ^ definitely recommend checking this list, not all were added
      plugins: [
        'asyncDoExpressions',
        'decimal',
        'destructuringPrivate',
        'doExpressions',
        'exportDefaultFrom',
        'functionBind',
        'importAssertions',
        'jsx',
        'partialApplication',
        ['pipelineOperator', { proposal: 'fsharp' }],
        ['recordAndTuple', { syntaxType: 'bar' }],
        'throwExpressions',
      ],
    },
    // last array item is run first
    plugins: [
      // @see https://emotion.sh/docs/@emotion/babel-plugin
      [
        require('@emotion/babel-plugin'),
        isClient
          ? {
              autoLabel: 'dev-only',
              cssPropOptimization: true,
              labelFormat: '[local]',
              sourceMap: true,
            }
          : false,
      ],
      [
        // @see https://babeljs.io/docs/en/babel-plugin-transform-runtime
        require('@babel/plugin-transform-runtime'),
        {
          corejs: false, // see preset env
          // using absolute paths is not desirable if files are compiled for use at a later time, but in contexts where a file is compiled and then immediately consumed, they can be quite helpful.
          absoluteRuntime: false,
          helpers: true,
          regenerator: true,
          version: '7.17.9', // babel runtime version
        },
      ],
      [require('@babel/plugin-transform-react-constant-elements'), isNode ? false : undefined],
      [require('@babel/plugin-transform-react-inline-elements'), isNode ? false : undefined],
    ],

    // @see https://babeljs.io/docs/en/babel-preset-env
    // @babel/preset-env won't include any JavaScript syntax proposals less than Stage 3
    // setting shippedProposals: true will include the limited set of stage 3 proposals implemented by browsers
    // modules: "amd" | "umd" | "systemjs" | "commonjs" | "cjs" | "auto" | false, defaults to "auto".
    // ^ set output type
    // ^ @see https://github.com/babel/babel/issues/8887
    presets: [
      [
        require('@babel/preset-env'),
        {
          bugfixes: true,
          debug: false,
          forceAllTransforms: false, // set to true if only support es5/running through uglifyjs
          ignoreBrowserslistConfig: false,
          modules: 'auto',
          shippedProposals: true,
          spec: false,
          useBuiltIns: 'usage', // include corejs imports for each file based on the env transpiling to and the files src code
          // entry: you have to specify the imports of core-js in src
          // usage: automatically imports core-js modules in src
          corejs: {
            version: '3.21.1',
            proposals: true,
          },
        },
      ],
      [
        require('@babel/preset-react'),
        isClient
          ? {
              // applies to both classic & automatic runtimes
              throwIfNamespace: false,

              // use automatic by default-----------------------------------------
              development: true,
              importSource: '@emotion/react', // https://emotion.sh/docs/css-prop##babel-preset
              runtime: 'automatic', // automatically import React shit at the top of files

              // uncomment for classic -------------------------------------------
              // "pragma": "React.default.createElement",
              // "pragmaFrag": "React.default.Fragment",
              // "runtime": "classic", // enables other commented options
              // "useBuiltIns": false,
              // "useSpread": true
            }
          : false,
      ],
      // @see https://babeljs.io/docs/en/babel-preset-flow
      [
        require('@babel/preset-flow'),
        {
          all: false,
          allowDeclareFields: true,
        },
      ],
    ],
  };
};

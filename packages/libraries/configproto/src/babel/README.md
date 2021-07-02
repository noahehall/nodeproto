# @nodeproto/configproto - babel configs

- you should prefer babel for its complexity and raw power
- use whenever you dont have time to write an swc plugin

- be sure you want the [mjs version with its significant drawbacks](https://babeljs.io/blog/2020/01/11/7.8.0)

- [specifying corejs version](https://github.com/zloirock/core-js/issues/946)
  - only set corejs in one place
  - preferably in preset-env so you can specify minor version
  - and get all the minor version goodiness
- [babel assumptions](https://babeljs.io/docs/en/assumptions)
  - "privateFieldsAsProperties": !isProd,
  - "constantReexports": isProd, // might change due to module.hot?

- modules to review
  - https://github.com/zloirock/core-js#babelpreset-env
    - debug: !isProd,
    - corejs
    -
  - https://github.com/babel/preset-modules
  - babel/preset-react
    - "development": !isProd
    - plugin-syntax-jsx
    - plugin-transform-react-jsx
    - plugin-transform-react-display-name
    - plugin-transofrm-react-jsx-self
    - plugin-transform-react-jsx-source
  - '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-catch-binding',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-private-methods',
    '@babel/plugin-proposal-throw-expressions',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-transform-modules-commonjs',
      importInterop: 'babel'
      - disable if treeshaking via webpack

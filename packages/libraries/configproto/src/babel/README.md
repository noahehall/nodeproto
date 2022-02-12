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
- [babel/runtime + babel/plugin-transform-runtime](https://babeljs.io/docs/en/babel-runtime)
  - runtime: runtime deps, ensures your output files are DRY
  - plugin runtime: replaces compiletime references with runtime references

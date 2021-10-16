# @nodeproto/configproto - reusable configs

## TLDR

- install
  - `pnpm add -D @nodeproto/configproto`

- developing
  - transpile files: `pnpm cjs`
  - transpile files with ultra: `pnpm ultra -- cjs`
  - you generally want the following env vars set
    - `BROWSERSLIST_ENV=@see ./browserslist/index.cjs`
    - `BROWSERSLIST_DANGEROUS_EXTEND=1` for shared configs

## links

- [createapp](https://createapp.dev/webpack/no-library)
- [node commonJS module spec](https://nodejs.org/api/modules.html)
- [node module API spec](https://nodejs.org/api/module.html)
- [node esm spec](https://nodejs.org/api/esm.html)
- [packages](https://nodejs.org/api/packages.html)
- [browserslist](https://github.com/browserslist/browserslist)

### worthy mentions

- [babel-plugin-transform-commonjs](https://github.com/tbranyen/babel-plugin-transform-commonjs)
  - convert commonjs modules to esm
- [commonjs vs esm syntax](https://2ality.com/2015/12/babel-commonjs.html)
  - 2ality the #bossgod
- [babel-preset-env](https://babeljs.io/docs/en/babel-preset-env)
  - mandatory in all babel configs
- [cosmiconfig](https://github.com/davidtheclark/cosmiconfig)
  - might have to join the crowd and use this
  - yea fkn right

- issues
  - think webpack changed something, getting errs about experiments
  - `configuration.experiments.buildHttp should be one of these`

# TLDR

static configuratoin files

- TODO: (automate this shit) you **HAVE** to remember to update the versions in the config files
- when upgrading dependencies
  - things to update: `grep -E "core-js|@babel|flow" package.json`
  - `base.babelrc`
    - `@babel/plugin-transform-runtime`
  - `client.babelrc`
    - `@babel/preset-env`
  - `node.babelrc`
    - `@babel/preset-env`

## errors

- eslint
  - be sure to add

      ```yml
        parserOptions:
          babelOptions:
            configFile: path/to/.babelrc
      ```

- webpack
  - TODO: caching not picking up deep dependency changes, e.g. modifying babel plugins forces us to set `cache: false` in webpack config

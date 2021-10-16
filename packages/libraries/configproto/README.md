# TLDR

static configuratoin files

most dependencies will be production dependencies
so that consumers of this library shouldnt need to install them

- TODO: (automate this shit) you **HAVE** to remember to update the versions in the config files
- when upgrading dependencies
  - things to update:
  - see new versions: `grep -E "core-js|@babel|flow" package.json`
  - update these files (could be out of date) with to match new version numbers
    - `babel.config.json`
    - `client.babelrc.json`
    - `node.babelrc.json`
    - `.eslintrc.yml`
    - `isomorphic.eslintrc.yml`
    - `.flowconfig`

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

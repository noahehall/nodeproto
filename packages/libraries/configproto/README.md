# TLDR

static configuratoin files

most dependencies will be production dependencies
so that consumers of this library shouldnt need to install them

- when upgrading dependencies
  - see new versions: `grep -E "core-js|@babel|flow" package.json`
  - update these files (could be out of date) to match new version numbers
    - babel files
    - flow config files
    - eslint files

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

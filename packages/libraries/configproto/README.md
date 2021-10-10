# TLDR

static configuratoin files

- you **HAVE** to remember to update the versions in the config files
- when upgrading dependencies

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

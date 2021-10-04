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

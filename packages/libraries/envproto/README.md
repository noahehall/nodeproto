# envproto: DRY environment management by @nodeproto

- default env vars defined in package.json.config
- can be overridden in `.env` file
- no need for `.env.default` file: just use your pkg.json.config!

## TLDR

1. create a `.env` file
2. specify env vars with keys matching the values you have in your package.json config
   - if a key is set with no value, the default will be taken from the package.json.config
   - if a key has a value, that will be used instead
   - secret keys should not be set in package.json.config

    ```bash
      # NODE_OPTIONS will use the default value provided in package.json.config.NODE_OPTIONS
      NODE_OPTIONS=

      # NODE_ENV will use the value specified here
      # and not the defualt value provided in package.json.config.NODE_ENV
      NODE_ENV=production

      # SECRET_KEY should not be set in package.json.config
      # we will still inject it into the environment
      SECRET_KEY=poop

    ```

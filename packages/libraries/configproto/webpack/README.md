# @nodeproto/configproto - webpack configs

- should prefer webpack for its complexity and raw power
- use whenever you dont have time to build an esbuild plugin

chain

1. `setup.webpack.config.mjs` generates default set of data to build via webpack
2. `base.webpack.config.mjs` starting point of a webpack configuration
   - use this when building for node?
3. build a specific type of application
   - `client.webpack.config.mjs` build something for the client
   - `react.esbuild.webpack.config.mjs` build a react application
   - all of these build for `development` by default?

4. build an application for a specific environment
   - `prod.webpack.config.mjs` build for production environment
   - `dev.wbpack.config.mjs` is this needed?

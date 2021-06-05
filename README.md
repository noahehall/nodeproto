# @nodeproto
  - monorepo for rapidly prototyping end-to-end, complex, and secure applications and microservices


| tech stach |
| :----------: |
| <img src="https://webpack.js.org/site-logo.1fcab817090e78435061.svg" width="100" align="left" /><img src="https://www.openapis.org/wp-content/uploads/sites/3/2018/02/OpenAPI_Logo_Pantone-1.png" width="100" align="left" /><img src="https://cdn.haproxy.com/wp-content/uploads/2017/10/haproxy-weblogo.png" width="100" align="left" /><img src="https://nodejs.org/static/images/logo.svg" width="100" align="left" /><img src="https://github.com/evanw/esbuild/raw/master/images/wordmark.svg" width="100" align="left" /><img src="https://avatars.githubusercontent.com/u/5429470?s=200&v=4" width="90" align="left" /><img src="https://hero35.com/stacks/react.svg" width="100" align="left" /><img src="https://raw.githubusercontent.com/koajs/koa/master/docs/logo.png" width="100" align="left" /><img src="https://user-images.githubusercontent.com/645641/79596653-38f81200-80e1-11ea-98cd-1c6a3bb5de51.png" width="100" align="left" /><img src="https://cdn.rawgit.com/standard/standard/master/badge.svg" width="100" align="left" /> |


## common tasks
  - if something doesnt work [please check our todo list](./doc/todos.md)
    - likely we've listened a work around, if not, create a github issue
### stable scripts
  - in general
    - every cmd comes with a `npm run DO:THIS:HELP` to see the help
  - the scripts
    - `npm run lerna:help` see lerna help
    - `npm run bootstrap` install dependencies in each package + hoisting common ones
    - `npm start` run the start script in each package for development
    - `npm test` run the test script in each package
    - `npm run lerna:run RUNSCRIPT` run an arbitrary script in all packages with the matching RUNSCRIPT name

### adding packages
  - `npm run add NPMPACKAGE packages/PKG`
    - e.g. `npm run add webpack-bundle-analyzer packages/client -- -D`
      - will install webpack-bundle-analyzer into packages/client
    - issues
      - you can only add ONE package at a time, i know wtf!
      - `--save-exact` isnt working, will figure this out later


### environment variables
  - each *package/package.json* should contain a `config` section with the default (and *public*) environment variables
    - *do not* create an `.env.example` - use the `package/package.json.config` section
  - create a `package/.env` file with environment variables you want to use in each microservice, referencing the name and values in the `package/package.json.config`
    - to apply default values specified in `package.json.config` set the var name in the `.env` file to nothing, e.g. `API_HTTP_PORT=` and `@nodeproto/envproto.syncEnv` will update `process.env.API_HTTP_PORT` to the value specified in the `package.json.config`
      - if the the `.env` file has a value for the variable, it WILL NOT be updated!
        - this is so values set via CLI or `.env` take precedence over `package.json.config` values

### enabling SSL
  - self-signed certificates auto created on dev

## dependencies
### dotfiles
  - [editorconfig](https://editorconfig.org/)
  - [gitignore](https://git-scm.com/docs/gitignore)
  - [gitattributes](https://git-scm.com/docs/gitattributes)
  - [npmrc](https://docs.npmjs.com/cli/v7/configuring-npm/npmrc)
  - [nvmrc](https://github.com/nvm-sh/nvm)
  - [hintrc](https://github.com/webhintio/hint/blob/main/packages/hint/docs/user-guide/configuring-webhint/summary.md)



### modules
#### stable
  - pkg management
    - [lerna](https://github.com/lerna/lerna/tree/main/commands)
    - [npm](npmjs.com/)

  - backend
    - [koa](https://koajs.com/#introduction)
      - [koa-body](https://github.com/koajs/koa-body/blob/9b00b40adbfc40a5f5f73efbc88108adf66bcf8b/index.js#L75)
      - [koa-compose](https://github.com/koajs/compose/blob/25568a36509fefc58914bc2a7600f787b16aa0df/index.js#L19)
      - [koa-jwt](https://github.com/koajs/jwt#example)
      - [koa-session](https://github.com/koajs/session#example)
      - [koa-helmet](https://github.com/venables/koa-helmet)
      - [@koa/cors](https://github.com/koajs/cors)
      - [koa-ratelimit](https://github.com/koajs/ratelimit)
      - [koa-oas3](https://github.com/atlassian/koa-oas3)

  - dev
    - [pem](https://github.com/Dexus/pem/blob/master/test/pem.spec.js)

  - tooling
    - [esbuild for apis](https://esbuild.github.io)
      - [always review this first b4 intalling babel plugins](https://esbuild.github.io/content-types/#javascript)
    - [webpack 5 + esbuild for client](https://webpack.js.org/)
      - frontend requires complex bundling to support a wide range of environments.
      - thus we use both webpack 5 + esbuild
    - [es-main](https://github.com/tschaub/es-main/blob/main/test.js)

  - frontend
    - [messageformat](https://github.com//messageformat)
    - [react](https://reactjs.org)

  - css
    - [normalize.css](https://github.com/necolas/normalize.css/)
    - [modernizr](https://github.com/Modernizr/Modernizr)

  - testing
    - [tape](https://github.com/substack/tape)
    - [multi-tape](https://github.com/mattiash/node-multi-tape)
    - [sinon](https://sinonjs.org/)

  - linting
    - [webhint/hint](https://github.com/webhintio/hint)
    - [standard](https://standardjs.com/#table-of-contents)

##### testing out
  - testing

  - misc

  - file serving
    - [koajs/favicon](https://github.com/koajs/favicon)

  - monitoring
    - [cls-rtracer](https://github.com/puzpuzpuz/cls-rtracer)

  - webpack
    - [esbuild-loader](https://github.com/privatenumber/esbuild-loader)


  - caching
    - [tinyhttp/etag](https://github.com/talentlessguy/tinyhttp/blob/348e95e8cee63c0f03eea46495f26d863315e1f0/packages/etag/src/index.ts#L27)

  - security
    - [koa-sslify](https://github.com/turboMaCk/koa-sslify)

  - routing
    - [koa-tree-router](https://github.com/steambap/koa-tree-router)
    - [joi-routing](https://github.com/koajs/joi-router)
    - [koa-router](https://github.com/koajs/router/tree/master/lib)





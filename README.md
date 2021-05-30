# nodeproto

## TLDR
  - I started from scratch so you dont have to

## stable scripts
  - `npm test` run all tests in lib/app directories
  - `npm start` dev, hot reload. transpile app with esbuild to node LTS
  - `npm run start:native` dev. latest node.
  - `npm run about` see ALL available scripts
  - `npm run logenv` see env vars available to app

## Demo app
### Open Api 3
  - [Package Checker v1](/app/api/routes/v1/README.md)
    - run `npm start`
    - [open localhost:3000/v1](http://localhost:3000/v1)


### TODOs
  - [run npm via script to provide some default node options for all pkgjson scripts](https://nodejs.org/api/cli.html)
  - error handling
  - review installed dependencies

## dependencies
### dotfiles
  - [editorconfig](https://editorconfig.org/)
  - [gitignore](https://git-scm.com/docs/gitignore)
  - [gitattributes](https://git-scm.com/docs/gitattributes)
  - [npmrc](https://docs.npmjs.com/cli/v7/configuring-npm/npmrc)
  - [nvmrc](https://github.com/nvm-sh/nvm)


### modules
#### stable
  - [koa](https://koajs.com/#introduction)
    - [koa-body](https://github.com/koajs/koa-body/blob/9b00b40adbfc40a5f5f73efbc88108adf66bcf8b/index.js#L75)
    - [koa-compose](https://github.com/koajs/compose/blob/25568a36509fefc58914bc2a7600f787b16aa0df/index.js#L19)
    - [koa-jwt](https://github.com/koajs/jwt#example)
    - [koa-session](https://github.com/koajs/session#example)
    - [koa-helmet](https://github.com/venables/koa-helmet)
    - [@koa/cors](https://github.com/koajs/cors)
    - [koa-ratelimit](https://github.com/koajs/ratelimit)
    - [koa-oas3](https://github.com/atlassian/koa-oas3)

  - [esbuild](https://esbuild.github.io)
    - [always review this first b4 intalling babel plugins](https://esbuild.github.io/content-types/#javascript)

  - testing
    - [tape](https://github.com/substack/tape)
    - [multi-tape](https://github.com/mattiash/node-multi-tape)
    - [sinon](https://sinonjs.org/)

##### testing out
  - testing
    - [tape](https://github.com/dwyl/learn-tape)


  - misc


  - file serving
    - [koajs/favicon](https://github.com/koajs/favicon)

  - monitoring
    - [cls-rtracer](https://github.com/puzpuzpuz/cls-rtracer)


  - caching
    - [tinyhttp/etag](https://github.com/talentlessguy/tinyhttp/blob/348e95e8cee63c0f03eea46495f26d863315e1f0/packages/etag/src/index.ts#L27)

  - security
    - [koa-sslify](https://github.com/turboMaCk/koa-sslify)

  - routing
    - [koa-tree-router](https://github.com/steambap/koa-tree-router)
    - [joi-routing](https://github.com/koajs/joi-router)
    - [koa-router](https://github.com/koajs/router/tree/master/lib)





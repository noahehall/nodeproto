# nodeproto

## TLDR
  - I started from scratch so you dont have to


### TODOs
  - force explicit module versions
## setup
### vscode
  - [editorconfig](https://editorconfig.org/)
  -

### git
  - [gitignore](https://git-scm.com/docs/gitignore)
  - [gitattributes](https://git-scm.com/docs/gitattributes)

### npm
  - [npmrc](https://docs.npmjs.com/cli/v7/configuring-npm/npmrc)
  - [package json](https://docs.npmjs.com/cli/v7/configuring-npm/package-json)
  -
### node
  - [nvm](https://github.com/nvm-sh/nvm)
  - [http server listen callback](http://nodejs.org/api/http.html#http_server_listen_port_hostname_backlog_callback)


### modules
#### good
  - [koa](https://koajs.com/#introduction)

##### testing out
  - misc
    - [koa-body](https://github.com/koajs/koa-body/blob/9b00b40adbfc40a5f5f73efbc88108adf66bcf8b/index.js#L75)
    - [koa-compose](https://github.com/koajs/compose/blob/25568a36509fefc58914bc2a7600f787b16aa0df/index.js#L19)

  - caching
    - [tinyhttp/etag](https://github.com/talentlessguy/tinyhttp/blob/348e95e8cee63c0f03eea46495f26d863315e1f0/packages/etag/src/index.ts#L27)

  - security
    - [koa-jwt](https://github.com/koajs/jwt#example)
    - [koa-session](https://github.com/koajs/session#example)
    - [koa-helmet](https://github.com/venables/koa-helmet)
    - [@koa/cors](https://github.com/koajs/cors)
    - [koa-ratelimit](https://github.com/koajs/ratelimit)


  - openapi
    - [koa-oas3 by atlassian](https://github.com/atlassian/koa-oas3)
    - [koa-openapi-validator beta thing](https://github.com/cdimascio/express-openapi-validator/tree/lerna-fastify/packages/koa-openapi-validator)

  - routing
    - [koa-tree-router](https://github.com/steambap/koa-tree-router)
    - [joi-routing](https://github.com/koajs/joi-router)
    - [koa-router](https://github.com/koajs/router/tree/master/lib)


#### to review
  - [jshttp](https://github.com/jshttp/http-assert)
    - low-level js http-related modules
    - koa relies heavily on this groups open source projects
  - [st static files + etc](https://github.com/isaacs/st#readme)
  -


### not so bad
  - [keyGrip](https://github.com/crypto-utils/keygrip)
    - hasnt been updated since 2019
    - thus [dont use koaApp.keys](https://github.com/koajs/koa/issues/1539)
      - find a more up-to-date approach if available

#### remove? askholz

  - [cookies](https://github.com/pillarjs/cookies)
    - hasnt been updated since apr 2020
    - thus doesnt use `ctx.cookies.ANYTHING
      - figure out how to do this better
  - [http errors](https://github.com/jshttp/http-errors)
    - hasnt been updated since jun 2020
    - refrain from using `ctx.throw()`
      - figure this shit out
      - for its purpose, the staleness may be irrelevant
      -
  - [http asset](https://github.com/jshttp/http-assert)
    - stale apr 2019
    - refrain from using `ctx.assert`
      - figure this shit out
  - content negotiation
    - affects *request.accepts(Encondings|Charsets|Languages)
    - [accepts](https://github.com/jshttp/accepts)
      - stale apr 2019
    - [negotiator](https://github.com/jshttp/negotiator)
      - stale apr 2019

#### dont use
  - [cabinjs](https://github.com/cabinjs/cabin/issues/148)
    - [likely should have read this first](https://cabinjs.com/?id=koa)
  - [koa better error handler](https://github.com/ladjs/koa-better-error-handler)
    - doesnt support koa-session-store
  - [koa cash](https://github.com/koajs/cash/issues/63)
    - simple fix, but why fkn bother
  - [koa-redis](https://github.com/koajs/koa-redis/issues/80)
    - stale ioredis dep
  - [koajs/etag](https://github.com/koajs/etag/blob/master/package.json)
    - stale dep etag (2018)

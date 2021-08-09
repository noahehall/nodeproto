
#### to review
  - [dotfiles by paulmillr](https://github.com/paulmillr/dotfiles)
  - [jshttp](https://github.com/jshttp/http-assert)
    - low-level js http-related modules
    - koa relies heavily on this groups open source projects
  - [st static files + etc](https://github.com/isaacs/st#readme)
  - [koajs/mount](https://github.com/koajs/mount)
  - [pnpm/beta as nvm replacement](https://github.com/pnpm/pnpm/discussions/3434)
    - nvm is perfect, not sure why but atleast check it out
  - [pnpm workspaces](https://pnpm.io/workspaces)
  - [aws opensearch](https://github.com/opensearch-project/OpenSearch)
    - aws fork of eslaticsearch
  - [changesets for mgnging release workflow](https://github.com/atlassian/changesets)
  - [find a use for reghex](https://github.com/kitten/reghex)
  - [pnpm nopt - fork of npms](https://github.com/pnpm/nopt)
  - [npm nopt](https://github.com/npm/nopt)
  - [pnpm action: setup pnpm](https://github.com/pnpm/action-setup)
  - [pnpm logger](https://github.com/pnpm/logger)
  - [ndjson](https://github.com/ndjson/ndjson.js)
  - [only-allow](https://github.com/pnpm/only-allow)
  - [checkout jssm](https://github.com/StoneCypher/jssm)

### not so bad
  - [keyGrip](https://github.com/crypto-utils/keygrip)
    - hasnt been updated since 2019
    - thus [dont use koaApp.keys](https://github.com/koajs/koa/issues/1539)
      - find a more up-to-date approach if available

#### remove

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
  - [koa-webpack](https://github.com/shellscape/koa-webpack)
    - didnt work with lerna|esm|who the fk knows

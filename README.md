# @nodeproto

- product development starterkit
  - focuses on full stack node+react apps running on AWS
  - vagrant + docker in dev (todo)
  - docker in prod (todo)
  - this project will become the base for the core nirvai web app

- hard requirements for develop branch
  - dependency requirements
    - all images pushed to [@nodeproto registry on aws](https://gallery.ecr.aws/z0c3n4h5/nodeproto/apps)
    - Arangodb (todo)
    - ClickHouse (todo)
    - Consul (todo)
    - flowtype >= 0.171.0
    - haproxy (needs virtualization)
    - koa => 2
    - node + corepack >= 17.5 (17.6 is out!)
    - OpenSSL >= 1.1.1 for TLSv1.3 support
    - pnpm >= 6.30.1
    - react + react-dom @rc (or @next)
    - Signoz APM (todo)
  - process requirements
    - package.json.config is controlled  by root/package.json and synced to child packages via tools/jsync
    - all packages export reusable type definitions as `@nodeproto/packagename/src/libdefs`
  - cultural boundaries
    - best in class > most popular
    - bleeding edge always
    - monorepo microservices > multirepo microservices
    - read the code > read the comments
    - specification > kitchen sinks
    - terse clarity > verbose expressiveness
    - tests are first class citizens
    - trunk > branch

## TLDR


- services
  - [@nodeproto/client - React@next frontend](packages/apps/client/README.md)
  - [@nodeproto/authnz - koa/openapi backend](packages/apps/authnz/README.md)
- libraries
  - [@nodeproto/configproto - Static configurations](packages/libraries/configproto/README.md)
  - [@nodeproto/shared - utility fns](packages/libraries/shared/README.md)
  - [@nodeproto/testproto - High Velocity test suite](packages/libraries/testproto/README.md)
  - [@nodeproto/envproto - env/SSL management](packages/libraries/envproto/README.md)
  - [@nodeproto/buildproto - esbuild/webpack: build anything run everywhere](packages/libraries/buildproto/README.md)
  - [@nodeproto/wtf - Where the file? system locations & file management](packages/libraries/wtf/README.md)
- tools
  - [@nodeproto/jsync - synchronize package.json[c] files](packages/tools/jsync/README.md)

### npm scripts

- you can prepend before any npm script
  - `proto` or `proto:script` cmd to run in all packages
    - proto runs cmds in each pkg via ultra
    - proto:script runs cmds in each pkg via pnpm
  - `ultra` to run via ultra-runner

### uninstall

- to remove this repository completely from your system
- delete the `/var/.nodeproto` directory, and this repository

### installation (contributing)

- vagrant (recommended), requires >= v2.2

```sh
  vagrant up
  vagrant ssh
  cd /opt/nodeproto
```

- bare metal
```sh
  # dependency + pnpm metadata
  sudo mkdir /var/.nodeproto
  sudo chown -R $(whoami):$(whoami) /var/.nodeproto
  pnpm install-completion
  pnpm install
  pnpm proto:script build
  pnpm proto:script repo:test
```

- other hellpful cmds

```sh
  # dependencies
  pnpm proto repo:flowtyped:install # install flowtype defs
  pnpm proto repo:jsync # synchronize root/package.json into each package/package.json

  # validation
  pnpm proto repo:lint

  # introspection
  pnpm repo:deps:graph
  pnpm repo:scripts:v
```


### updating

```sh
  pnpm proto repo:update # updates all deps to latest
```

### running tests & lints

```sh
  pnpm repo:lint # runs eslint (fix mode), prettier, flow + type coverage
  pnpm repo:eslint # runs eslint flow & prettier, fails on first package with lint errs
  pnpm repo:eslint:fix # same as above, but doesnt fail
  pnpm repo:flow:coverage # runs flow with type def coverage
  pnpm flow # detailed flowtype analysis
  pnpm flow stop|start # restart flow server, sometimes it fails to pick up changes to deep external libdefs
  pnpm repo:test # run tests
  pnpm repo:testing # watch & rerun tests in a single package
  pnpm repo:test:file somefile # run a specific test file

```

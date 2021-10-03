
- start from scratch (if getting pnpm|node errors)
  - [remove pnpm](https://pnpm.io/uninstall)
  - then fall through setup below

- setup `@nodeproto` for development

  - ~~now that node is installed, use corepack to manage pnpm~~
    - ~~dont do this step until corepack is useable, or manageable via pnpm env (not sure which is the issue)~~
    - ~~install corepack `pnpm install -g corepack`~~
    - ~~update `packageManager` in `root/package.json` to the version of pnpm installed earlier~~
    - ~~manage pnpm via corepack `corepack enable`~~
    - ~~sync global version `corepack prepare pnpm@6.15.1 --activate`~~

- [publishing a new version](https://pnpm.io/using-changesets)
  - create a new changeset `pnpm changeset`
  - version bump `pnpm changeset version`
  - update lockfile and rebuild pkgs `pnpm install`
  - commit changes
  - [should automate this via github action](https://pnpm.io/using-changesets#using-github-actions)

- **TODO** default cmds available to all (appropriate) pkgs
  - test|test:ci|test:integration|test:e2e|test:ing (unit)|test:ing:e2e
    - ci - no concurrency (nothing should be concurrent in ci)
    - integration see @nodeproto/tests/integration
    - e2e see @nodeproto/tests/e2e
    - test:ing i.e. watch
  - build|build:prod
    - depending on the pkg, this could utilize swc, esbuild, or webpack (in increasing order of complexity, with decreasing order of build efficiency)
    - e.g. swc > esbuild > webpack build speed
    - but webpack > esbuild > swc in terms of managed complexity and flexibility
  - lint (should fix by defualt)
    - eslint
  - jsync
    - sync package/package.json with root/package.json
  - start:native:dev|start:native:prod|start:cloud:dev|start:cloud:prod
    - native - baremetal
    - cloud - docker
- cmds provided by ultra

- easy to forget syntax of pnpm (TODO: move this to theBookOfNoah)
  - `pnpm add PKG`
    - @nodeproto/PKG add an internal pkg to another pkg
    - ./somedir/or/somefile.tar (a dir or file)
    - <git remote url>
      - latest commit from master `kevva/is-positive`
      - specific commit `kevva/is-positive#97edff6f525f192a3f83cea1944765f769ae2678`
      - specific branch `kevva/is-positive#master`
    - <https://github.com/indexzero/forever/tarball/v0.5.6>
    - -D dev deps
    - -O optional deps
    - -P dep (this is defualt)
    - --save-peer both dev and peer deps
    - --global (dont do it, just use pnpm exec)
  - [pnpm install](https://pnpm.io/cli/install)
  - pnpm -r exec pnpm up latest
    - upgrade all packages to their latest
      - fks up react alpha
  - [pnpm remove](https://pnpm.io/cli/remove)
  - [pnpm link](https://pnpm.io/cli/link)
  - [pnpm unlink](https://pnpm.io/cli/unlink)
  - [pnpm import](https://pnpm.io/cli/import)
    - useful when migrating from another pkg manager, e.g. yarn|npm
  - [pnpm fetch](https://pnpm.io/cli/fetch)
    - useful when building a docker image
  - [pnpm audit](https://pnpm.io/cli/audit)
  - [pnpm list](https://pnpm.io/cli/list)
  - [pnpm outdated](https://pnpm.io/cli/outdated)
  - [pnpm why](https://pnpm.io/cli/why)
  - [pnpm run](https://pnpm.io/cli/run)
    - doesnt run pre/post scripts, however ultra does
  - [pnpm publish](https://pnpm.io/cli/publish)
  - [pnpm pack](https://pnpm.io/cli/pack)
  - [pnpm recursive](https://pnpm.io/cli/recursive)
  - [pnpm server](https://pnpm.io/cli/server)
  - [pnpm store](https://pnpm.io/cli/store)

tests

- generally unit tests are located next to their source files
- integration & e2e tests are in `packages/tests`
  - check `packages/tests/integration` for runnable & reference implementations
  - TODO: e2e tests will be in `packages/tests/e2e`
- [uvu until we break it](https://github.com/lukeed/uvu)

other shit

- add the pnpm logo: <https://pnpm.io/logos>

- thoughts on micro frontends
  - if you're current dev experience is crap, i can totally see why you would go through the trouble of a single spa
  - if you're in a wonderfully designed monorepo, utilizing the latest version of git, with an awesome devops workflow, we'll keep the jokes between us

- thoughts on precommit hooks
  - prefer pre-merge|rebase hooks
    - <https://git-scm.com/docs/githooks#_pre_merge_commit>
    - <https://git-scm.com/docs/githooks#_pre_rebase>
  - i generally dislike anything that slows down development when another non-slow-me-down paradigm exists
    - i understand this is a losing battle, so likely i will implement a `pre-push` hook to meet the community halfway

- thoughts on meta, yarn, npm, pnpm: and why i chose pnpm and where ultra-runner + loop fits in
  - <https://pnpm.io/motivation>
  - <https://pnpm.io/cli/exec>
  - <https://pnpm.io/cli/dlx>
  - <https://pnpm.io/filtering>
  - <https://pnpm.io/cli/env>
  - <https://pnpm.io/package_json>
  - <https://pnpm.io/npmrc>
  - <https://pnpm.io/pnpm-workspace_yaml>
  - <https://pnpm.io/pnpmfile>
  - <https://pnpm.io/aliases>
  - <https://medium.com/pnpm/pnpm-vs-lerna-filtering-in-a-multi-package-repository-1f68bc644d6a>
  - we actually dont need ultra runner, you can run all cmds above via `pnpm -r CMD` + filtering, parallelism, etc.
    - however: have you seen the heavenly output of ultra-runner?
  - we actually dont need loop, however... **TODO**

- thoughts on cloud native
  - definitely the way to go.... after everything works on baremetal
  - im 100% for virtualization, but baremetal is still best for debugging

- [npmrc pnpm specific](https://pnpm.io/npmrc)
- [update pnpm publishConfig before publishing](https://pnpm.io/package_json)
- [use this link to add to our readmefile for pnpm](https://pnpm.io/installation)
- [migrating from typescript to flow](https://github.com/niieani/typescript-vs-flowtype)
- [finish setting up github packages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [finish setting up gitub container registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [finish setting up snyk](https://app.snyk.io/org/noahehall/manage/integrations/github)
- [finish setting up codeql](https://codeql.github.com/docs/codeql-for-visual-studio-code/)
- [finish settin gup gitpod](https://gitpod.io/workspaces/)
- [finish setting up security workflows](https://github.com/noahehall/nodeproto/actions)
- [finish setting up github beta release projects](https://github.com/noahehall/nodeproto/projects/1?add_cards_query=is%3Aopen)

| tech stach |
| :----------: |
| <img src="https://webpack.js.org/site-logo.1fcab817090e78435061.svg" width="100" align="left" /><img src="https://www.openapis.org/wp-content/uploads/sites/3/2018/02/OpenAPI_Logo_Pantone-1.png" width="100" align="left" /><img src="https://cdn.haproxy.com/wp-content/uploads/2017/10/haproxy-weblogo.png" width="100" align="left" /><img src="https://nodejs.org/static/images/logo.svg" width="100" align="left" /><img src="https://github.com/evanw/esbuild/raw/master/images/wordmark.svg" width="100" align="left" /><img src="https://avatars.githubusercontent.com/u/5429470?s=200&v=4" width="100" align="left" /><img src="https://hero35.com/stacks/react.svg" width="100" align="left" /><img src="https://raw.githubusercontent.com/koajs/koa/master/docs/logo.png" width="100" align="left" /><img src="https://camo.githubusercontent.com/32657601b349b558831f32c553cb2c7734cb5ae89a2e8340afa314ea3b2116a0/68747470733a2f2f6d696c6c696772616d2e696f2f696d616765732f7468756d626e61696c2e706e67" width="100" align="left" />|

- [signature verification required for contributors](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification)

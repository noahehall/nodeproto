#!/usr/bin/env node


/**
 * @see https://pnpm.io/pnpm-cli
 * @see https://pnpm.io/cli/exec
 * @see https://pnpm.io/filtering
 * @see https://docs.npmjs.com/cli/v7/using-npm/config
 * @see https://medium.com/pnpm/pnpm-vs-lerna-filtering-in-a-multi-package-repository-1f68bc644d6a

  npm install -g pnpm // install pnpm
  pnpm add -g pnpm // upgrade
  pnpm add NAME // install a pkg
  pnpm CMD // run a cmd (use ultra instead)
  pnpm exec CMD // specifically run a node_modules/.bin
  pnpm i // install all pkgs from package.json
  pnpm config ls -l // see config values
  // TODO
    - the filtering link
    - pnpm uses npm config + all pnpm options can be set, see npm/config link


  // TLDR
    // general options
      -r // exec CMD in each pkg
      --parallel // ignore concurrency & topological sorting, and immediatley invoke cmd in each pkg
    // install
      --offline // grab pkgs from store
      --prefer-offline // use store if available, else fetch
      --frozen-lockfile // dont update pnpm-lock.yaml
      --lockfile-only // only pnpm-lock.yaml is updated
    // add specific pkgs
      pnpm add ./someDir
      pnpm add ./someZipTypeFile.(tar|gz|tgz)
      pnpm add react@">=0.1.0 <0.2.0"
      pnpm add some_git_remote_url
    // install/add related cli options
      -D // devDependencies
      -O // optionalDependencies
      --save-peer
      -W // save to workspace root
      --global
      --workspace // only add the dep if its found in the workspace
      -E // save-exact, always do this

  // examples
    - prune node_modules installations for all packages
    pnpm -r exec -- rm -rf node_modules
    - view package information for all packages
    pnpm -r exec -- pnpm view $PNPM_PACKAGE_NAME
    - fetch & run a pkg binary without installing it (i.e. np)
    pnpx PKG ...


 */

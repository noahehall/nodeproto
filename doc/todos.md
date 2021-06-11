# long list of todos in one place
## TODOS
  - add [YEOMAN for scaffolding new microservices](https://yeoman.io/)
  - move esbuild popcopy plugin to packages/@nodeproto/esbuild-popcopy-plugin
  - [run npm via script to provide some default node options for all pkgjson scripts](https://nodejs.org/api/cli.html)
  - error handling
  - review installed dependencies
  - [finish setting up webhint](https://github.com/webhintio/hint/blob/main/packages/hint/docs/user-guide/hints/index.md)
  - [switch to intern test framework](https://github.com/theintern/intern)
  - [setup globalize](https://github.com/globalizejs/globalize/tree/master/examples/node-npm)
  - [setup react + amp](https://medium.com/@rtymchyk/react-amp-modern-approach-e45de3fe84c7)
  - [move to htmlwebpackplugin template](https://github.com/jantimon/html-webpack-plugin#writing-your-own-templates)
    - so we can reuse pkgjson.confg and .env values inside template
      - e.g. id='root' should id='process.env.REACT_APP_ID'
  - need a bash script to find a replace things
    - e.g. when changing API_PORT to API_HTTP_PORT would be great to do this from a script instead of an editor
  - remove dotenv from all packages except @nodeprot/lib
    - require @nodeproto/lib/envproto on the cmd line and it should accept a package.json path argument and use it to update the env
    - think about a `--upsert config` argument that allows us to use the pkg.json.config values even if they are missing from .env
      - currently you have to set `config.KEY=` in `.env` to upsert the values, but this isnt DRY
  - ensure we are using appropriate [pkgjson fields](https://docs.npmjs.com/cli/v7/configuring-npm/package-json)
  - finish setting up haproxy
    - ssl termination
    - integration with @nodeprot/lib/envproto.getdevserts thing
  - [pick our default detections @ modernizr](https://modernizr.com/download?setclasses)
  - [think babel-eslint is canceling out standard-js rules](https://github.com/babel/eslint-plugin-babel)
  - [see if theres any merit to this](https://www.npmjs.com/package/accessibility-checker)
  - [checkout the merits of this](https://github.com/Siteimprove/alfa)
  - had to remove from pkgcheck
    - "create-hintrc": "3.0.11",
    - "hint": "6.1.3",
  - dont need both env-cmd and dotenv
  - rush should only isntall ONCE, not 3 fkn retires if failure
  - removed from client
    - "create-hintrc": "3.0.11",
    - "hint": "6.1.3",
  - go through this shit
      ```sh
        '--trace-sync-io',
            '--http-parser',
            '--no-warnings',
            '--experimental-vm-modules',
            '--force-context-aware',
            '--experimental-worker',
            '--experimental-import-meta-resolve',
            '--experimental-report',
            '--experimental-wasi-unstable-preview1',
            '--no-deprecation',
            '--heapsnapshot-signal',
            '--no-force-async-hooks-checks',
            '--require',
            '--report-on-signal',
            '--trace-exit',
            '--heapsnapshot-near-heap-limit',
            '--inspect-port',
            '--no-node-snapshot',
            '--perf-prof-unwinding-info',
            '--trace-tls',
            '--tls-max-v1.2',
            '--jitless',
            '--track-heap-objects',
            '--perf-prof',
            '--experimental-modules',
            '--huge-max-old-generation-size',
            '--trace-deprecation',
            '--perf-basic-prof-only-functions',
            '--disallow-code-generation-from-strings',
            '--stack-trace-limit',
            '--experimental-repl-await',
            '--trace-uncaught',
            '--node-memory-debug',
            '--max-old-space-size',
            '--redirect-warnings',
            '--report-signal',
            '--tls-min-v1.0',
            '--insecure-http-parser',
            '--tls-keylog',
            '--conditions',
            '--report-uncaught-exception',
            '--experimental-specifier-resolution',
            '--inspect-brk',
            '--experimental-loader',
            '--secure-heap',
            '--use-largepages',
            '--max-http-header-size',
            '--use-openssl-ca',
            '--tls-cipher-list',
            '--interpreted-frames-native-stack',
            '--report-filename',
            '--experimental-abortcontroller',
            '--openssl-config',
            '--experimental-policy',
            '--icu-data-dir',
            '--diagnostic-dir',
            '--report-on-fatalerror',
            '--experimental-json-modules',
            '--trace-sigint',
            '--enable-fips',
            '--debug-arraybuffer-allocations',
            '--trace-atomics-wait',
            '--abort-on-uncaught-exception',
            '--secure-heap-min',
            '--trace-event-file-pattern',
            '--tls-min-v1.1',
            '--napi-modules',
            '--experimental-top-level-await',
            '--use-bundled-ca',
            '--zero-fill-buffers',
            '--disable-proto',
            '--frozen-intrinsics',
            '--perf-basic-prof',
            '--v8-pool-size',
            '--force-fips',
            '--trace-event-categories',
            '--report-dir',
            '--preserve-symlinks',
            '--title',
            '--report-compact',
            '--experimental-wasm-modules',
            '--inspect',
            '--trace-warnings',
            '--throw-deprecation',
            '--verify-base-objects',
            '--policy-integrity',
            '--inspect-publish-uid',
            '--preserve-symlinks-main',
            '--tls-min-v1.2',
            '--pending-deprecation',
            '--unhandled-rejections',
            '--enable-source-maps',
            '--input-type',
            '--tls-min-v1.3',
            '--tls-max-v1.3',
            '--debug-port',
            '-C',
            '--loader',
            '--prof-process',
            '-r',
            '--trace-events-enabled',
            '--es-module-specifier-resolution',
            '--report-directory',

      ```

## DONE
  - defaults from pkg.json.config not being used
    - you shouldnt have to set identical vars in pkg.json.env if the value is set in pkg.json.config
    - have load .env via a .js file to upsert values both ways
    -

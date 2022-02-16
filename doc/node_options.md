# @nodeproto: node options

- [latest node_options spec](https://nodejs.org/api/cli.html#node_optionsoptions)
- we rely heavily on root/package.json.config.node_options
- packages/jsync is used to sync root/node_options to all child packages/node_options

```sh
# reporting & diagnostics
--diagnostic-dir=\"/var/.nodeproto\" # this dir must exist, node doesnt create it
--redirect-warnings=warnings
--report-compact
--report-dir=\"/var/.nodeproto\" # this dir must exist, node doesnt create it
--report-filename=node-report
--report-on-fatalerror
--report-on-signal
--report-signal=SIGUSR2
--report-uncaught-exception

# enable/report on warnings
--pending-deprecation
--trace-deprecation
--trace-exit
--trace-sigint # specifically for SIGINT
--trace-warnings # process warnings + deprecations
--unhandled-rejections=strict

# enable node features
--enable-source-maps
--experimental-abortcontroller
--experimental-fetch
--experimental-import-meta-resolve
--experimental-json-modules
--experimental-loader=\"./node_modules/@nodeproto/configproto/src/node/loaders/flow.mjs\"
--experimental-modules
--experimental-specifier-resolution=node
--experimental-top-level-await
--tls-max-v1.3
--tls-min-v1.3
--use-largepages=on # nodejs static code to be moved onto 2MiB pages isntead of 4 KiB
```

- node options requiring experimentation
```sh
# dont use: @see https://github.com/lukeed/uvu/issues/192
# ^ issue may be with NODE, as babel fails to run as well
--v8-pool-size=0 # v8 will chose an appropriate pool size based on # of online processors
--heapsnapshot-near-heap-limit
--max-old-space-size
--heapsnapshot-signal= # potentially should be used in prod to investigate uncaught exceptions
--policy-integrity=sri # @see https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity
--secure-heap-min
--secure-heap
--use-bundled-ca
--use-openssl-ca
--zero-fill-buffers
--preserve-symlinks-main # main module follows the symlink strategy as other modules
--preserve-symlinks # use symlink path for modules (not on disk path); useful for peer deps

```

- unused node options
```sh
--redirect-warnings=warnings
--conditions, -C
--disable-proto
--dns-result-order
--enable-fips
--experimental-policy
--experimental-vm-modules
--experimental-wasi-unstable-preview1
--experimental-wasm-modules
--force-context-aware
--force-fips
--frozen-intrinsics
--http-parser
--icu-data-dir
--input-type
--insecure-http-parser
--inspect-brk
--inspect-port, --debug-port
--inspect-publish-uid
--inspect
--max-http-header-size
--napi-modules
--no-addons
--no-deprecation
--no-experimental-repl-await
--no-extra-info-on-fatal-exception
--no-force-async-hooks-checks
--no-global-search-paths
--no-warnings
--node-memory-debug
--openssl-config
--openssl-legacy-provider
--prof-process
--require, -r
--throw-deprecation
--title # sets process title
--tls-cipher-list
--tls-keylog
--tls-max-v1.2
--tls-min-v1.0
--tls-min-v1.1
--tls-min-v1.2
--trace-atomics-wait
--trace-event-categories
--trace-event-file-pattern
--trace-events-enabled
--trace-uncaught # effects GC negatively
--trace-sync-io
--trace-tls
--track-heap-objects
```

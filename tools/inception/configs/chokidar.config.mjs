import path from 'path';

export const chokidarConfigDefault = {
    alwaysStat: true,
    atomic: true,
    awaitWriteFinish: { stabilityThreshold: 2000, pollInterval: 100 },
    binaryInterval: 300,
    cwd: path.resolve('..'),
    depth: 99,
    disableGlobbing: false,
    ignored: path => [
      /\/(dist|test|node_modules)\//,
      /\.test\./, // files containing .test.filetype
      /(^|[\/\\])\../, // dotfiles
    ].some(regex => regex.test(path)),
    ignoreInitial: true,
    ignorePermissionErrors: false,
    interval: 100,
    persistent: true,
    useFsEvents: false,
    usePolling: true,
    usePolling: false,
  }

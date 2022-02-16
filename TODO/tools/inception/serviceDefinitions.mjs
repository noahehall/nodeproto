import { getDirs } from '@nodeproto/wtf';

export const dirs = getDirs();

export const globalOptions = {
  chokidarConfig: {},
  runner: 'npm run', // enum(true)
  watchGlob: /src\/.*\.(c|m)?js|css|tsx$/, // javascript and css files
};

// @see https://github.com/nodejs/node-eps/blob/master/002-es-modules.md#4-compatibility
// symlinks to ~/.node_modules will always work, with a performance hit but hey
/**
 * destructure to create a new dependency
 */
const defaultService = {
  // chokidarConfig: {}, // TODO: currently using a single watcher for all deps
  // runner: 'npm run', // e.g. yarn|rushx|npx
  // watchGlob: /src\/.*\.(c|m)?js|css|tsx$/, // javascript and css files
  scriptBuild: '', // e.g. build
  scriptStart: '', // e.g. start
  upstreamDeps: [], // pkgJson.name, list of pkgs this pkg depends on
  watch: true,
  workDir: '', // directory with pkg.json, must be unique
};

export const dep1 = {
  ...defaultService,
  workDir: './fixtures/fakedeps/dep1',
  upstreamDeps: ['dep2'],
  scriptBuild: 'build:dep1',
};

export const dep2 = {
  ...defaultService,
  workDir: './fixtures/fakedeps/dep2',
  scriptBuild: 'build',
};

export const client = {
  ...defaultService,
  workDir: '../../apps/client',
  scriptStart: 'start:dev',
  upstreamDeps: ['dep1'],
};


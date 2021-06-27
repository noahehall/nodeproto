
let client, dep1, dep2, dup2, dep3;

/**
 * if pushWithoutBuild && yalcPush
 */
const defaultConfig = {
  watchGlob: /\.(c|m)?js|css$/, // javascript and css files
  chokidarConfig: {}, // TODO: currently using a single watcher for all deps
  name: '', // pkgJson.name // only required if pkgs have the same name (not sure why but hey),
  pushAfterBuild: true,
  pushWithoutBuild: false, // push a pkg without building it
  runner: 'npm run', // e.g. yarn|rushx|npx
  scriptBuild: '', // e.g. build
  scriptStart: '', // e.g. start
  upstreamDeps: [], // pkgJson.name@pkgJson.version, list of pkgs@version this pkg depends on
  watch: true,
  workDir: '', // ../../dirWithPkgJson
}

dep3 = {
  ...defaultConfig,
  pushWithoutBuild: true,
  workDir: '../../../fakedeps/dep3/',
}

dep2 = {
  ...defaultConfig,
  name: 'dep2',
  scriptBuild: 'build',
  workDir: '../../../fakedeps/dep2/',
};
dup2 = dep2;

dep1 = {
  ...defaultConfig,
  name: 'dep1',
  scriptBuild: 'build:dep1',
  workDir: '../../../fakedeps/dep1/',
  upstreamDeps: ['dep2'],
};

client = {
  ...defaultConfig,
  name: '@nodeproto/client',
  runner: 'rushx',
  scriptStart: 'client:dev',
  upstreamDeps: [dep1.name, 'dep3'],
  watch: false,
  workDir: '../../apps/client/',
};


export default [client, dep1, dep2, dup2, dep3];

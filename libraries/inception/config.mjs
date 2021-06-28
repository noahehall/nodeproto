
let dep1, dep2;

/**
 * destructure to create a new dependency
 */
const defaultConfig = {
  watchGlob: /src\/.*\.(c|m)?js|css|tsx$/, // javascript and css files
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

const baseDir = '../../../../nodeproto/';


dep1 = {
  ...defaultConfig,
  name: 'insert package.json.name',
  workDir: baseDir + 'dep1',
  scriptBuild: 'build:es',
}

pageComponents = {
  ...defaultConfig,
  name: 'insert package.json.name',
  workDir: baseDir + 'dep2',
  upstreamDeps: ['insert package.json.name'],
  scriptBuild: 'dev:build',
}


export default [dep1, dep2];

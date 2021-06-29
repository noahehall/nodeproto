import fs from 'fs';
import { homedir } from 'os';

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
  upstreamDeps: [], // pkgJson.name, list of pkgs this pkg depends on
  watch: true,
  workDir: '', // ../../dirWithPkgJson
}


const baseDir = '../../../../foss/';

export const inceptionStore = `${homedir()}/node_modules`;


export const dep1 = {
  ...defaultConfig,
  workDir: baseDir + 'fakedeps/dep1',
  upstreamDeps: ['dep2'],
  scriptBuild: 'build:dep1',
}

export const dep2 = {
  ...defaultConfig,
  workDir: baseDir + 'fakedeps/dep2',
  scriptBuild: 'build',
}

export const client = {
  ...defaultConfig,
  workDir: baseDir + 'nodeproto/apps/client',
  runner: 'rushx',
  startScript: 'start:dev',
  upstreamDeps: ['dep1'],
}

/**
 * @nodeproto/inception
 * watch multiple paths and run scripts on file changes at specific life cycle junctures
 * use case: developing a client with downstream local dependencies within a dependency within a dependency.... within a dependency... within a dream
 *
 * @see https://github.com/wclr/yalc/blob/master/test/index.ts
 * @see https://reflectoring.io/upstream-downstream/
 * @see https://github.com/micromatch/anymatch
 * @see https://github.com/paulmillr/chokidar
 */
import { hideBin } from 'yargs/helpers';
import chokidar from 'chokidar';
import defaultConfigs from './config.mjs';
import fs from 'fs';
import path from 'path';
import shelljs from 'shelljs';
import yargs from 'yargs';
import yalc, {
  addPackages,
  checkManifest,
  getRunScriptCmd,
  parsePackageName,
  publishPackage,
  updatePackages,
} from 'yalc';


// console.log(yalc);
// import { spawn } from 'child_process';
// import readline from 'readline';

const cwd = process.cwd();

// TODO: chalk that bitch
const logger = console.log.bind(console);
const warner = console.warn.bind(console);
const errorer = console.error.bind(console);
const log = (...msgs) => logger.apply(null, ['\ninfo\n', ...msgs]);
const warn = (...msgs) => warner.apply(null, ['\nwarn\n', ...msgs]);
const error = (...msgs) => errorer.apply(null, ['\nerror\n', ...msgs]);
const success = log;
const info = log;
const IFS = '||';

const pathsToWatch = [];
const pkgDirWatchMap = new Map(); // only for watched paths
const startablePkgs = new Set();
const pushablePkgs = new Set();
const buildablePkgs = new Set();
const uniquePkgs = new Map();

const isBuildable = ({ scriptBuild, inception = { pkgJson: { scripts: {} }}} = {}) => scriptBuild && scriptBuild in inception.pkgJson.scripts;
const isPushable = pkg => (isBuildable(pkg) && pkg.pushAfterBuild) || pkg.pushWithoutBuild;
const isStartable = ({ scriptStart, inception = { pkgJson: { scripts: {} }}} = {}) => scriptStart && scriptStart in inception.pkgJson.scripts;


const getPkgKey = ({ name, workDir } = {}) => `${workDir}${IFS}${name}`;

const chokidarConfigDefault = {
  alwaysStat: false,
  atomic: true,
  awaitWriteFinish: { stabilityThreshold: 2000, pollInterval: 100 },
  binaryInterval: 300,
  cwd,
  depth: 99,
  disableGlobbing: false,
  ignored: [
    './dist/**/*',
    '*\.test\.*', // files containing .test.filetype
    '**/test/**/*', // all test directories
    './node_modules/**/*',
    /(^|[\/\\])\../, // dotfiles
  ],
  ignoreInitial: true,
  ignorePermissionErrors: false,
  interval: 100,
  persistent: true,
  usePolling: false,
}

const inceptionBaseConfig = {
  built: false,
  depsDownstream: new Set(), // we depend on these
  depsDownstreamLinked: false,
  depsUpstream: new Set(), // they depenend on us
  pkgJson: {},
  published: false,
  running: false,
};

const getPkgName = (pkg) => (
  `${pkg.inception.pkgJson.name}`//@${pkg.inception.pkgJson.version.replace(/\@|\^|\~/g, '')}`
);

const upsertConfigs = ({
  chokidarConfig = {},
  workDir = new Error('workDir required in config'),
  name = '', // required if watching multiple pkgs in the same workdir

  ...config
} = {}) => {
  const workingDir = path.resolve(cwd, workDir);
  const pkg = {
    inception: {
      ...inceptionBaseConfig,
      workDir: workingDir,
    },
    ...config,
    chokidarConfig: {
      ...chokidarConfigDefault,
      ...chokidarConfig,
      cwd: workingDir,
    },
    name,
    workDir: workingDir,
  };

  shelljs.cd(workingDir);
  shelljs.ls('package.json').forEach(pkgJsonString => {
    if (!pkgJsonString) {
      log('unable to find pkgjson: ', workingDir, name);

      pkg.inception.pkgJson = {};
    }
    else {
      pkg.inception.pkgJson = JSON.parse(shelljs.cat(pkgJsonString));

      const useName = getPkgName(pkg);
      log('using pkg name', useName)
      pkg.name = useName;
      pkg.key = getPkgKey(pkg);
    }
  });

  shelljs.cd(cwd);

  return pkg;
};

const setUniquePkgs = async configs => {
  log('creating unique deps');
  configs.forEach(config => {
    const pkg = upsertConfigs(config);

    if (uniquePkgs.has(pkg.key)) {
      return warn('NOT overriding previous pkg with duplicate name: ', pkg.workDir, pkg.name);
    }
    else uniquePkgs.set(pkg.key, pkg);

    try {
      const buildable = isBuildable(pkg);
      const pushable = !buildable && isPushable(pkg);
      const startable = isStartable(pkg);

      if (buildable) buildablePkgs.add(pkg.key);
      if (pushable) pushablePkgs.add(pkg.key);
      if (startable) startablePkgs.add(pkg.key);
    } catch (e) {
      error('setting up unique packages', e)
    }
  });
}

// const yalcLink = async pkgId => shelljs.exec(`yalc add ${pkgId}`)
const linkPkgs = async () => {
  info('setting up pkg links');
  const cmdsToRun = []
  for (const [pkgKey, pkg] of uniquePkgs) {
    const [workDir, pkgName] = pkgKey.split(IFS);
    if (!Array.isArray(pkg.upstreamDeps) || !pkg.upstreamDeps.length) continue;

    // shelljs.cd(workDir);
    pkg.upstreamDeps.forEach(upstreamDepName => {
      cmdsToRun.push(`yalc link ${upstreamDepName}`)
      // shelljs.exec(`yalc add ${upstreamDepName}`)
    });
    // shelljs.cd('-')
    // const response = await yalc.addPackages(
    //   pkg.upstreamDeps,
    //   {
    //     link: true, // we need them in the global .yalc dir
    //     linkDep: true,
    //     update: false,
    //     workingDir: workDir,
    //   }
    // );

    // yalcPush()
  }

  for (const [workDir, pkgName] of startablePkgs) {
    shelljs.cd(workDir);
    cmdsToRun.forEach(cmd => {
      console.log('\n\n linking', workDir, cmd)
      shelljs.exec(cmd);
    })
    shelljs.cd('-')
  }
};

const yalcPush = async (publishOptions = new Error('publishOptions required in yalcPush')) => {
  try {
    const response = await yalc.publishPackage(publishOptions);
  } catch (e) {
    error('pushing pkg', publishOptions, e);

    throw `exiting immediately`
  }

  return true;
}

const pushPkgs = async (pkg = false, push = false) => {
  const publishOptions = !push && false ? {} :
    {
      push: true,
      changed: false,
      update: false,
      replace: true,
    }
  if (pkg) {
    shelljs.cd(pkg.workDir);
    shelljs.exec(`yalc push`)
    return shelljs.cd('-')
    // return yalcPush({ ...publishOptions, workingDir: pkg.workDir });
  }
  // force pushable pkgs
  for (const pkgKey of pushablePkgs) {
    const [workDir, pkgName] = pkgKey.split(IFS);
    // await yalcPush({ ...publishOptions, workingDir: workDir });
    shelljs.cd(workDir);
    shelljs.exec(`yalc push`); // use to be publish
    shelljs.cd('-')
  }

  return true;
}


/**
 * build and push pkgs
 */
const buildPkgs = async (usePkg = false) => {
  if (!buildablePkgs.size && !usePkg) return log('no buildable pkgs: ', !buildablePkgs.size, !usePkg);

  if (usePkg) { // rebuilding
    const { scriptBuild, runner } = usePkg;

    log('rebuilding: ', usePkg.name, scriptBuild, usePkg.inception.pkgJson.scripts[scriptBuild]);

    shelljs.cd(usePkg.workDir);
    if (shelljs.exec(`${runner} ${scriptBuild}`).code !== 0) {
      pkg.inception.built = false;

      shelljs.echo('Error building pkg: ', pkgName);
    }
    else {
      usePkg.inception.built = true;

      log('pkg built: ', usePkg.inception.pkgJson.name)
      log('republishing...', usePkg.name)
      if (isPushable(usePkg) && pushPkgs(usePkg, true));
    }

    shelljs.cd(cwd);

    return true;
  }

  else {
    for (const pkgKey of buildablePkgs) {
      const [workDir, pkgName] = pkgKey.split(IFS);

      const pkg = uniquePkgs.get(pkgKey);
      const { scriptBuild, runner } = pkg;

      log('building: ', pkgName, scriptBuild, pkg.inception.pkgJson.scripts[scriptBuild]);

      shelljs.cd(workDir);
      if (shelljs.exec(`${runner} ${scriptBuild}`).code !== 0) {
        pkg.inception.built = false;

        shelljs.echo('Error building pkg: ', pkgName);
      }
      else {
        pkg.inception.built = true;

        log('pkg built: ', pkg.inception.pkgJson.name)
        log('publishing...')
        if (isPushable(pkg) && pushPkgs(pkg));
      }

      uniquePkgs.set(pkgKey, { ...pkg, scriptBuild, runner });
      shelljs.cd(cwd);
    }
  }
}

const startWatching = async () => {
  for (const [pkgKey, pkg] of uniquePkgs) {
    const [workingDir, pkgName] = pkgKey.split(IFS);
    if (pkg.watch) {
      pkgDirWatchMap.set(workingDir, pkg);

      pathsToWatch.push(workingDir)
    }

  }

  log('watching directories: ', pathsToWatch)
  const watcher = chokidar.watch(
    pathsToWatch,
    chokidarConfigDefault,
  );

  const errorCallback = async usePath => {
    error(`watching path ${usingPath}`)
  }

  // @see https://stackoverflow.com/questions/37521893/determine-if-a-path-is-subdirectory-of-another-in-node-js
  const pkgOf = (path1, path2) => {
    if (path1 === path2) return true;
    const [parent, child] = path1.length > path2.length
      ? [path2, path1]
      : [path1, path2]

    const relative = path.relative(parent, child);
    return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
  }

  const rebuildCallback = async usePath => {
    const filename = path.basename(usePath);
    const dirname = path.resolve(cwd, path.dirname(usePath));

    for (const [workingDir, pkg] of pkgDirWatchMap) {
      if (pkgOf(dirname, workingDir)) {
        log(`${pkg.name}: file change alert! ${filename}`)
        if (pkg.watchGlob.test(filename)) {
          log('initiating rebuild: ', pkg.name)

          await buildPkgs(pkg);

          return true;
        }
      }
    }

    warn('could not find pkg related to changed file: ', filename, dirname, pkgDirWatchMap)
  }

  // add, addDir, change, unlink, unlinkDir, ready, raw, error
  watcher.on('add', rebuildCallback);
  watcher.on('addDir', rebuildCallback);
  watcher.on('change', rebuildCallback);
  watcher.on('error', errorCallback);

  return true;
}

const checkSetup = async () => {
  // setUniqueDeps
  await setUniquePkgs(defaultConfigs);

  // build requested packages
  await buildPkgs();
  await pushPkgs();
  await linkPkgs();
  await startWatching();
  /**
   * brainstorm logic
   * + likely isnt update-to-date as this was brainstormed before any code was wrritten

   state: required[setUniqueDeps, built, published, linked, run, watch]
   * 1. for all configs, set unique deps with upserted configs
   * 2. setUniqueDeps(configs)

   state: required[built, published, linked, run, watch]
   * 2. for all !!pkgs.buildScript
   * 3. $ cd pkgs.workDir
   * 4. $ run pkgs.buildScript
   * 5. set pkgs.inception.built = true
   *

   state: required[published, linked, run, watch]
   * 1. for all !!uniquePkgs.publishScript
   * 2. $ cd config.workDir
   * 3. $ config.publishScript
   * 4. set config.inception.published = true

  state: required[linked, run, watch]
   * 1. uniquePkgs.forEach(pkg => {
          if (!pkg.deps.length || !!pkg.inception.depsLinked) return;

          $ cd pkg.inception.workDir;
          pkg.deps.forEach(dep => yalcLink(dep.inception.name))

          pkg.inception.depsLinked = true;
        }

   state: required[run, watch]
   * 1. uniquePkgs.forEach(pkg => {
          if (!pkg.startScript) return;
          $ run pkg.startScript
          set pkg.inception.running = true;
        })

   state: required[watch]
   * 1. uniquePkgs.foEach(pkg => {
          if (!pkg.workDirWatchGlob || !pkg.buildScript) return;

          $ run createChokidarWatch(pkg);
          $ when chokidar[change|addfile|adddir|etc]
              $ if (!!pkg.buildScript) run pkg.buildScript
              $ yalcPush(pkg.inception.name)
        })
   */

}


const argv = yargs(hideBin(process.argv)).argv;

if (argv.h) console.log('one of', '-h', '--clean', '--check')
else if (argv.check) checkSetup();
else if (argv.clean) {
  log('cleaning directories')
  shelljs.exec('yalc installations show');
  shelljs.exec('yalc installations clean')
}
else error('still working on checkSetup(), please send --check')

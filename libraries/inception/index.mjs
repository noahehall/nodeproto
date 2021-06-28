/**
 * @nodeproto/inception
 * watch multiple paths and run scripts on file changes at specific life cycle junctures
 * use case: developing a client with downstream local dependencies within a dependency within a dependency.... within a dependency... within a dream
 *
 * @see https://github.com/wclr/yalc/blob/master/test/index.ts
 * @see https://reflectoring.io/upstream-downstream/
 * @see https://github.com/micromatch/anymatch
 * @see https://github.com/micromatch/anymatch/pull/15/files
 * @see https://github.com/paulmillr/chokidar
 * @see https://github.com/paulmillr/chokidar/issues/773
 */
import { hideBin } from 'yargs/helpers';
import chokidar from 'chokidar';
import defaultConfigs from './config.mjs';
import fs from 'fs';
import path from 'path';
import shelljs from 'shelljs';
import yargs from 'yargs';
import { chokidarConfigDefault } from './configs/chokidar.config.mjs';
import { inceptionBaseConfig } from './configs/inception.config.mjs';

import { 
  error,
  IFS,
  info,
  isBuildable,
  isPushable,
  isStartable,
  log,
  success,
  warn,
  getPkgName,
  getPkgKey,
} from './utils/index.mjs';
import yalc, {
  addPackages,
  checkManifest,
  getRunScriptCmd,
  parsePackageName,
  publishPackage,
  updatePackages,
} from 'yalc';


const cwd = process.cwd();

const pathsToWatch = [];
const pkgDirWatchMap = new Map(); // only for watched paths
const startablePkgs = new Set();
const pushablePkgs = new Set();
const buildablePkgs = new Set();
const uniquePkgs = new Map();


export const upsertConfigs = ({
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

  shelljs.cd('');

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
  info('linking packages');
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
  log('pushing packages');
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
  log('building packages');

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
  log('starting watcher');
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
    error(`watching path ${usePath}`)
  }

  // @see https://stackoverflow.com/questions/37521893/determine-if-a-path-is-subdirectory-of-another-in-node-js
  const pkgOf = (path1, path2) => {
    
    
    if (path1 === path2) return true;
    const [parent, child] = path1.length > path2.length
    ? [path2, path1]
    : [path1, path2]
    
    console.log('\n\n parent:child', parent, child);
    const relative = path.relative(parent, child);
    
    const response = relative && !relative.startsWith('..') && !path.isAbsolute(relative);
    console.log('\n\n relative', response, relative, !relative.startsWith('..'), !path.isAbsolute(relative) );

    return response
  }

  const rebuildCallback = async usePath => {
    const filename = path.basename(usePath);
    const dirname = path.resolve(cwd, path.dirname(usePath));

    for (const [workingDir, pkg] of pkgDirWatchMap) {
      if (pkgOf(dirname, workingDir)) {
        // log(`${pkg.name}: file change alert! ${filename}`)
        if (pkg.watchGlob.test(filename)) {
          log('initiating rebuild: ', pkg.name)

          await buildPkgs(pkg);

          return true;
        } else return false;
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
}


const argv = yargs(hideBin(process.argv)).argv;

if (argv.h) console.log('one of', '-h', '--clean', '--check')
else if (argv.run) checkSetup()
else if (argv.clean) {
  log('cleaning directories')
  shelljs.exec('yalc installations show');
  shelljs.exec('yalc installations clean')
}
else error('still working on checkSetup(), please send --check')

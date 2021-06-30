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
import * as serviceDefinitions from './serviceDefinitions.mjs';
import fs from 'fs';
import path from 'path';
import shelljs from 'shelljs';
import yargs from 'yargs';
import { promisify } from 'util';
import { chokidarConfigDefault } from './configs/chokidar.config.mjs';
import { inceptionBaseConfig } from './configs/inception.config.mjs';

import {
  error,
  IFS,
  info as infoIt,
  isBuildable,
  isPushable,
  isStartable,
  log as logit,
  success,
  warn,
  getPkgName,
  getPkgKey,
} from './utils/index.mjs';

const noop = () => void(0);
const symlink = promisify(fs.symlink);
const rm = promisify(fs.rm)
const { inceptionStore, ...defaultConfigs} = serviceDefinitions;

let log; // send in -v for verbosity, log will log
let info; // send in -q for quiet, quiet will silce infos
const cwd = process.cwd();

const pathsToWatch = [];
const pkgDirWatchMap = new Map(); // only for watched paths
const startablePkgs = new Set();
const pushablePkgs = new Set();
const buildablePkgs = new Set();
const uniquePkgs = new Map();

const cdBack = async (toDir, runningFn, backDir, because = '') => {
  log(`${because}: moving to ${toDir}`)

  try {
    shelljs.cd(toDir)
    await runningFn

    log(`${because} completed & returning to ${backDir || '-'}`);

    shelljs.cd(backDir || '-');

  } catch (e) {
    return e;
  }

  return true;
}


export const upsertConfigs = async ({
  chokidarConfig = {},
  workDir = new Error('workDir required in config'),
  name = '', // required if watching multiple pkgs in the same workdir

  workingDir = path.resolve(cwd, workDir),

  ...config
} = {}) => {
  info(`creating config for dir: ${workingDir}`);

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

  const response = shelljs.ls(workingDir + '/package.json').forEach(pkgJsonString => {
    if (!pkgJsonString) {
      log('unable to find pkgjson: ', workingDir, name);

      pkg.inception.pkgJson = {};
    }
    else {
      pkg.inception.pkgJson = JSON.parse(shelljs.cat(pkgJsonString));
      pkg.inception.version = pkg.inception.pkgJson.version.replace(/\@|\^|\~/g, '');

      const useName = getPkgName(pkg);
      log('using pkg name', useName)
      pkg.name = useName;
      pkg.key = getPkgKey(pkg);
    }
  })

  if (response instanceof Error) {
    error('upserting configs', response);
  }

  log(`successfully created config for ${pkg.name}`)
  return pkg;
};

const setUniquePkgs = async configs => {
  let totalPkgs = 0;
  info(`determining unique services in ${Object.keys(configs).length} service definitions`);

  for (const config of configs) {
    const pkg = await upsertConfigs(config);

    if (uniquePkgs.has(pkg.key)) {
      return warn('NOT overriding previous pkg with duplicate name: ', pkg.workDir, pkg.name);
    }
    else uniquePkgs.set(pkg.key, pkg);

    try {
      const prevB = buildablePkgs.size;
      const prevP = pushablePkgs.size;

      const willBuild = !!isBuildable(pkg);
      const forcePush = !willBuild && isPushable(pkg);
      const willStart = !!isStartable(pkg);

      log('pkg management plan: ', pkg.name, `\n build: ${willBuild}`, `\n push: ${willBuild || forcePush}`, `\n start: ${willStart}`);

      if (willBuild) buildablePkgs.add(pkg.key); // always pushed
      else if (forcePush) pushablePkgs.add(pkg.key) // force push unbuildable packages
      if (willStart) startablePkgs.add(pkg.key);
      else if (prevB === buildablePkgs.size && prevP === pushablePkgs.size & !willStart) {
        warn('found unusable pkg, you should remove from service definition: ', pkg.name);
        continue;
      }

      ++totalPkgs;
    } catch (e) {
      error('setting up unique packages', e);
    }
  };

 return info('unique services saved:', totalPkgs, `\n build & push: ${buildablePkgs.size}`, `\n force pushing: ${pushablePkgs.size}`, `\n starting: ${startablePkgs.size}`)
}

const setSymlink = async (from, to) => symlink(from, to).catch(e => console.error(e))
const getPkgVersion = pkgName => (
  Array.from(uniquePkgs.values()).filter(pkg => pkg.name === pkgName).pop().inception.version
)

// @see https://nodejs.org/api/process.html#process_process_execpath
// @see https://github.com/nodejs/node-eps/blob/master/002-es-modules.md#4-compatibility
// @see https://nodejs.org/api/esm.html (no NODE_PATH)
// @see https://nodejs.org/api/modules.html (uses NODE_PATH)
// + package manager tips
const linkPkgs = async () => {
  info('linking packages');
  let packagesLinked = 0;
  // const cmdsToRun = []
  for (const [pkgKey, pkg] of uniquePkgs) {
    const [workDir, pkgName] = pkgKey.split(IFS);
    console.log('\n\n wtf is this', workDir, pkgName)
    if (!Array.isArray(pkg.upstreamDeps) || !pkg.upstreamDeps.length) continue;
    shelljs.cd(workDir);
    for (const depName of pkg.upstreamDeps) {
      // const depVersion = getPkgVersion(depName);

      // from store to downstream/node_modules
      await setSymlink(inceptionStore + '/' + depName, path.resolve('./node_modules/'))
      // from store to ~/nodemodules/pkg/version
      // await setSymlink(storePath + depName + '/' + depVersion, path.resolve('./node_modules/' + depName + '/' + depVersion))
      ++packagesLinked;
    };
    shelljs.cd('-')

  }

  return info('finished linking packages: ', packagesLinked)
};


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
    setSymlink(inceptionStore + '/' + pkg.name + '/' , pkg.workDir);
  }
  // force pushable pkgs
  for (const pkgKey of pushablePkgs) {
    const [workDir, pkgName] = pkgKey.split(IFS);

    const pkgVersion = getPkgVersion(pkgName);
    log('creating symlink', workDir, pkgName, pkgVersion);
    setSymlink(workDir, inceptionStore + '/' + pkgName );
    // shelljs.cd('-')
  }

  return true;
}


/**
 * build and push pkgs
 */
const buildPkgs = async (usePkg = false) => {
  info('building package(s): ', usePkg && usePkg.name || buildablePkgs.size);

  if (!buildablePkgs.size && !usePkg) return log('no buildable pkgs');

  if (usePkg) { // rebuilding
    const { scriptBuild, runner } = usePkg;

    log('rebuilding: ', usePkg.name, scriptBuild, usePkg.inception.pkgJson.scripts[scriptBuild]);

    await cdBack(
      usePkg.workDir,
      (() => {
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
      })(), undefined, 'rebuilding pkg'
    )

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

  return info('packages built: ', buildablePkgs.size)
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

    console.log('\n parent:child', parent, child);
    const relative = path.relative(parent, child);

    const response = relative && !relative.startsWith('..') && !path.isAbsolute(relative);
    console.log('\n relative', response, relative, !relative.startsWith('..'), !path.isAbsolute(relative) );

    return response
  }

  const rebuildCallback = async usePath => {
    const filename = path.basename(usePath);
    const dirname = path.resolve(cwd, path.dirname(usePath));

    info(`${filename} is trying to wake up in ${dirname}: putting back to sleep`);
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


const getStorePackages = () => fs.readdirSync(inceptionStore + '/packages');


const runInception = async () => {
  info('putting applications to sleep in: ', inceptionStore);
  await setUniquePkgs(Object.values(defaultConfigs));
  await buildPkgs();
  await pushPkgs();
  await linkPkgs();
  await startWatching();

  success('all applications are happily sleeping');
}


const argv = yargs(hideBin(process.argv)).argv;

log = argv.v ? logit : noop;
info = argv.q ? noop : infoIt;

const availScripts = [
  '\n @nodeproto/inception',
  '\n get the best experience by putting your development environment into a happily dreaming state',
  '\n where applications of all colors, sizes, and languages can work together and be the best they can be',
  '\n\n',
  'standard POSIX meanings: ',
  '\n options',
    '\n -q', '-v', '-h',
  '\n commands',
    '\n --run *builds > watches > rebuilds dreams in a beautiful dev experience*',
    '\n --show *lists current dreams in your wonderfully fantastic development environment'
];

const nuke = async () => {
  infoIt(`waking up dreaming applications in ${inceptionStore}`);
  // shelljs.exec('yalc installations show');
  // shelljs.exec('yalc installations clean');

  // for (const dirpath of getStorePackages()) {
  //   await rm(inceptionStore + '/packages/' + dirpath, { recursive: true })
  // }
  success('environment back to waking state')
}
if (argv.h) success(...availScripts);
else if (argv.run) nuke().then(() => runInception());
// else if (argv.show) shelljs.exec('yalc installations show');
else if (argv.clean) nuke();
else error('@nodeproto/inception, cmd required') || infoIt(...availScripts);

/**
 * @see https://github.com/paulmillr/chokidar
 * @see https://github.com/paulmillr/chokidar/issues/773
 */
import {
  ErrorWatchPkgs,
} from './errors.mjs';
import chokidar from 'chokidar';
import { chokidarConfigDefault } from '../configs/chokidar.config.mjs';

const pathsToWatch = new Map();
const watchablePkgs = new Set();

// force a full rebuild by default, longer but less things to worry about
// TODO: we need to understand if they are using an internal watch
// + likely they should set pkg.watch = false
const rebuildCallback = async usePath => {
  console.log('\n\n rebuild called')
  const filename = path.basename(usePath);
  const dirname = path.resolve(cwd, path.dirname(usePath));

  console.log('\n\n\n rebuild cb', filename, dirname, pathsToWatch.entries());

  info(`${filename} is trying to wake up in ${dirname}: putting back to sleep`);

  // for (const [pkgKey, pkg] of pathsToWatch) {
  //   if (pkgOf(dirname, workDirAbs)) {
  //     // log(`${pkg.name}: file change alert! ${filename}`)
  //     if (pkg.watchGlob.test(filename)) {
  //       log('initiating rebuild: ', pkg.name)

  //       await buildPkgs(pkg);

  //       return true;
  //     } else return false;
  //   }
  // }

  // warn('could not find pkg related to changed file: ', filename, dirname, pkgDirWatchMap)
}

const errorCallback = async usePath => {
  ErrorWatchPkgs('unable to watch path', { usePath, pathsToWatch }, 'chokidar error')
}

const watchPkgs = async () => {
  info('starting watcher');

  for (const pkgKey of watchablePkgs) {
    const pkg = commandCenter.pkgs.get(pkgKey);

    if (!pkg) ErrorWatchPkgs(
      'unknown pkg found',
      { pkgKey, pkgs: commandCenter.pkgs.keys() },
      'watch error'
    )
    else pathsToWatch.set(pkgKey, pkg.workDirAbs)
  }

  log('watching directories: ', pathsToWatch);
  // TODO: run this in child process
  const watcher = chokidar.watch(
    Array.from(pathsToWatch.values()),
    chokidarConfigDefault,
  );

  // add, addDir, change, unlink, unlinkDir, ready, raw, error
  watcher.on('add', rebuildCallback);
  watcher.on('addDir', rebuildCallback);
  watcher.on('change', rebuildCallback);
  watcher.on('error', errorCallback);

  return true;
}

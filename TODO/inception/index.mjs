/**
 * @nodeproto/inception
 * build, link and run dependencies
 * use case: developing a client with downstream local dependencies within a dependency within a dependency.... within a dependency... within a dream
 *
 * @see https://reflectoring.io/upstream-downstream/
 * @see https://github.com/micromatch/anymatch
 * @see https://github.com/micromatch/anymatch/pull/15/files
 */

import { hideBin } from 'yargs/helpers';
import { inceptionBaseConfig } from './configs/inception.config.mjs';
import monitor from 'ultra-runner/lib/monitor.js';
import { promisify } from 'util';
import * as serviceDefinitions from './serviceDefinitions.mjs';

// import fs from 'fs'; // TODO: change this to fs-extra
import path from 'path';
import wtf from '@nodeproto/wtf';
// import shelljs from 'shelljs';
import ultra from 'ultra-runner';
import yargs from 'yargs';

import {
  cdBack,
  error,
  ErrorBuildPkgs,
  ErrorCompileServiceDefinitions,
  ErrorCreatePkgManagementPlan,
  ErrorCreateServiceConfig,
  ErrorInception,
  ErrorLinkPkgs,
  ErrorRunInception,
  info as infoIt,
  isBuildable,
  isStartable,
  log as logIt,
  std,
  success,
  warn,
} from './utils/index.mjs';

// module globals
const noop = () => void(0);
const rm = wtf.fs.rm;
const shelljs = wtf.shelljs;
const symlinkDir = wtf.symlinkDir;

// @see https://github.com/folke/ultra-runner/blob/master/src/cli.ts
const Runner = new ultra.Runner();
const { nodeTop } = monitor;

let log; // send in -v for verbosity, log will log
let info; // send in -q for quiet, quiet will silce infos
const cwd = process.cwd();


const buildablePkgs = new Set();
const linkablePkgs = new Map(); // need a map to track dep -> [downstreamDeps];
const startablePkgs = new Set();

const { globalOptions, dirs, ...services } = serviceDefinitions;

//TODO
const commandCenter = {
  dirs,
  pkgs: new Map(),
  state: {
    built: new Set(),
    building: new Set(),
    synced: new Set(),
    syncing: new Set(),
  },
  runner: globalOptions.runner,
};

const babysit = async () => {
  nodeTop(3000);
};

// TODO
export const createServiceConfig = async ({
  key = ErrorCreateServiceConfig('key'),
  workDir = ErrorCreateServiceConfig('workDir'),

  workDirAbs = path.resolve(cwd, workDir),

  ...config
} = {}) => {
  info(`creating config for service ${key} in ${workDirAbs}`);

  const pkg = {
    ...config,
    key,
    workDirRel: workDir,
    workDirAbs, // does not contain a trailing slash
  };

  const pkgJsonString = shelljs.ls(workDirAbs + '/package.json')?.[0];

  if (typeof pkgJsonString !== 'string') {
    ErrorCreateServiceConfig('unable to find pkgjson', { key, workDir, workDirAbs, pkgJsonString }, 'filepath');

    pkg.json = {};
  }
  else {
    try {
      pkg.json = JSON.parse(shelljs.cat(pkgJsonString));
      pkg.version = pkg.json.version.replace(/\@|\^|\~/g, '');
      pkg.name = pkg.json.name;

      success(`successfully created config for ${key} installable as ${pkg.name}`);
    } catch (e) {
      ErrorCreateServiceConfig(e.message, { key, workDir, workDirAbs, pkg }, 'unknown');
    }
  }

  return pkg;
};


/**
 * links and upstream pkg to its downstream (grand)parents
 *
 * @see https://github.com/zkochan/symlink-dir
 * @see https://nodejs.org/api/process.html#process_process_execpath
 * @see https://github.com/nodejs/node-eps/blob/master/002-es-modules.md#4-compatibility
 * @see https://nodejs.org/api/esm.html (no NODE_PATH)
 * @see https://nodejs.org/api/modules.html (uses NODE_PATH)
 *
 * @param {*} pkgKey
 * @param {*} downstreamDeps
 * @return {number} total packages linked
 */
const linkPkgsTailCall = async (pkgKey, downstreamDeps) => {
  if (!pkgKey || !downstreamDeps) ErrorLinkPkgs(
    'pkgKey && downstream Deps required in linkPkgsTailCall',
    { pkgKey, downstramDeps },
    'required'
  );

  if (!downstreamDeps.size) {
    log(`${pkgKey} has no downstram deps, removing from linkablePkgs`, downstreamDeps);

    linkablePkgs.delete(pkgKey);

    return 0;
  }

  let packagesLinked = 0;

  for (const depKey of downstreamDeps) {
    const pkg = commandCenter.pkgs.get(pkgKey);
    const downstreamDep = commandCenter.pkgs.get(depKey);

    log(`linking ${pkgKey} to ${depKey}`, pkg.workDirAbs, downstreamDep.workDirAbs);

    const { reused, warn } = await symlinkDir(
      pkg.workDirAbs, // from
      downstreamDep.workDirAbs + '/node_modules/' + pkg.name // to
    ).catch(e => ErrorLinkPkgs(
      'error link downstream dependencies',
      { e, name: pkg.name, pkg, },
      'symlinkDir'
    ));

    if (warn) ErrorLinkPkgs(
      warn,
      { pkg, downstreamDep, pkgKey, depKey },
      'link pkgs'
    );

    ++packagesLinked;
  }

  return packagesLinked;
};

/**
 * links an arbitrary number of downstream pkgs to their upstream (grnad)parents
 *
 * @param {*} pkgKey
 * @param {*} downstreamDeps
 * @return {*}
 */
const linkPkgs = async (pkgKey, downstreamDeps) => {
  info('linking package(s)');

  let packagesLinked = 0;

  if (pkgKey || downstreamDeps) packagesLinked = linkPkgsTailCall(pkgKey, downstreamDeps);
  else {
    for (const [pkgKey, downstreamDeps] of linkablePkgs.entries()) {
      packagesLinked = await linkPkgsTailCall(pkgKey, downstreamDeps);
    };
  }

  success('finished linking packages: ', packagesLinked);

  return true;
};

/**
 * builds a single pkg
 * @see https://2ality.com/2015/06/tail-call-optimization.html
 *
 * @param {*} pkg the pkg to build
 * @return {*}
 */
const buildPkgsTailCall = async (pkg) => {
  if (!pkg || !pkg.key) ErrorBuildPkgs('unable to build pkgs: invalid pkg', { pkg }, 'buildPkgsTailCall');

  const {
    key: pkgKey,
    scriptBuild,
    json,
    workDirAbs,
    runner = globalOptions.runner,
  } = pkg;

  commandCenter.state.building.add(pkgKey);
  commandCenter.state.built.delete(pkgKey);

  log('running build script: ', scriptBuild, '->', json.scripts[scriptBuild]);
  try {
    await cdBack(
      workDirAbs,
      async () => {
        try {
          await Runner.run(scriptBuild, json);

          log('pkg built: ', pkgKey, json.name);
        } catch (e) {
          ErrorBuildPkgs(`error in ${pkgKey} build script: ${scriptBuild}`, e, 'build error');
          commandCenter.state.built.delete(pkgKey);
          commandCenter.state.building.delete(pkgKey);
          pkg.inception.built = false;

          return false;
        }

        commandCenter.state.built.add(pkgKey);
        commandCenter.state.building.delete(pkgKey);
      },
      `${commandCenter.state.built.has(pkgKey) ? 'rebuilding' : 'building'} pkg`
    ); // end cdBack
  } catch (e) {
    ErrorBuildPkgs('unknown error building single pkg', { e, pkg, pkgKey }, 'build pkgs tailcall');

    return false;
  }

  return true;
};

/**
 * builds a single, or all pkgs
 *
 * @param {*} [pkg={}] if present, will only build this pkg
 * @return {*} bool true if pkg(s) were built
 */
const buildPkgs = async (pkg) => {
  if (!buildablePkgs.size) return log('no buildable pkgs');

  info('building package(s): ', pkg?.key ?? buildablePkgs.size);
  if (pkg) return buildPkgsTailCall(pkg);

  return Array.from(buildablePkgs.values()).forEach(pkg => {
    try {
      return buildPkgs(commandCenter.pkgs.get(pkg));
    } catch (e) {
      ErrorBuildPkgs('unable to build all pkgs', { e, pkg }, 'pkg build error');
    }
  });
};

/**
 * Creates a pkg management plan for each pkg management configuration
 *
 * @return {Promise} resolving to bool indicating success
 */
const createPkgManagementPlan = async () => {
  let totalPkgs = 0;

  const pkgs = commandCenter.pkgs.entries();
  info(`creating pkg management plan for ${commandCenter.pkgs.size} service definitions: ${Array.from(commandCenter.pkgs.keys())}`);

  for (const [pkgKey, pkg] of pkgs) {
    const prevB = buildablePkgs.size;
    const pkgsToLink = pkg.upstreamDeps;
    const willStart = !!isStartable(pkg);

    log(
      'pkg management plan: ', pkg.name, `\n build: ${prevB}`, `\n link: ${pkgsToLink.length}`, `\n start: ${willStart}`

    );

    try {
      if (isBuildable(pkg)) buildablePkgs.add(pkgKey);

      if (pkgsToLink.length) pkgsToLink.forEach(dep => {
        if (!linkablePkgs.has(dep)) linkablePkgs.set(dep, new Set());

        linkablePkgs.get(dep).add(pkgKey);
      });

      if (willStart) startablePkgs.add(pkgKey);

      if (prevB === buildablePkgs.size && !willStart) {
        warn('found unusable pkg, you should remove from service definition: ', pkgKey, pkg.name);
        continue;
      }

      ++totalPkgs;
    } catch (e) {
      ErrorCreatePkgManagementPlan('setting up unique packages', { e, pkgKey, pkg }, 'create');
    }
  };

  if (!totalPkgs) ErrorCreatePkgManagementPlan('services are neither buildable, pushable, or startable', { totalPkgs }, 'service definitions');

  success(
    'unique services saved:', totalPkgs, `\n packages to build: ${buildablePkgs.size}`, `\n packages to link: ${linkablePkgs.size}`, `\n packages to start: ${startablePkgs.size}`
  );

  return true;
};

/**
 * Ingests service definitions and creates pkg managent configurations
 *
 * @return {Promise} resolving to bool indicating success
 */
const compileServiceDefinitions = async () => {
  info('\n compiling service definitions');

  for (const [key, def] of Object.entries(services)) {
    const pkg = await createServiceConfig({ key, ...def });

    if (!pkg) error('\n could not create pkg', key, def);
    else if (commandCenter.pkgs.has(key)) ErrorCompileServiceDefinitions('duplicate service', { key, def }, 'unique service');
    else commandCenter.pkgs.set(key, pkg);
  }

  log('\n commandCenter', commandCenter);

  return true;
};

/** @type {*} array of available scripts suitable for logging to stdout */
const availScripts = [
  std.error('\n@nodeproto/inception'),
  '\n get the best experience by putting your development environment into a happily dreaming state',
  '\n where applications of all colors, sizes, and languages can work together and be the best they can be',
  '\n\n',

  std.info('standard POSIX meanings: '),
  '\n @see https://tldp.org/LDP/abs/html/options.html',
  '\n commands and options:',

  // inception (help) contract
    `\n\n ${std.log('inception')} *outputs inception CLI contract to stdout*`,
    `\n\t example: ${std.log('./ultra inception')}`,

  // check contract
    `\n\n ${std.log('check')} *validates && runs inception with verbose logging*`,
    `\n\t options: ${std.log('--build')} *also validate service builds*`,
    `\n\t options: ${std.log('--link')} *also validates linking upstream depependencies*`,
    `\n\t example: ${std.log('./ultra check --build --link')}`,

  // run contract
    `\n\n ${std.log('run')} *builds > links > and monitors dreams in a beautiful dev experience*`,
    `\n\t options: ${std.log('-q')} *runs quietly*`,
    `\n\t options: ${std.log('-v')} *runs verbosely*`,
    `\n\t example: ${std.log('./ultra run -v')}`,
];

const { argv } = yargs(hideBin(process.argv));

// review: https://stackoverflow.com/questions/23861917/logging-stdout-and-stderr-of-node
if (argv.v) log = argv.v ? logIt : noop, info = infoIt;
else if (argv.q) info = argv.q ? noop : infoIt, log = noop;
else log = noop, info = infoIt;

const pkgManagementPlanLifecycle = async () => Promise.resolve()
  .then(() => compileServiceDefinitions())
  .then(() => createPkgManagementPlan())
  .catch(e => ErrorInception('pkg management plan lifecycle error', { e }, 'lifecycle'));

const buildPkgsLifecycle = async () => Promise.resolve()
  .then(() => buildPkgs())
  .catch(e => ErrorInception('build pkgs lifecycle error', { e }, 'lifecyle'));

const linkPkgsLifecycle = async () => Promise.resolve()
  .then(() => linkPkgs())
  .catch(e => ErrorInception('link pkgs lifecycle', { e }, 'lifecycle'));

/** inception invocation */
(async () => {
  if (argv.help) success(...availScripts);
  else if (argv.check) {
    log = logIt;
    info = infoIt;

    await pkgManagementPlanLifecycle();

    if (argv.build) await buildPkgsLifecycle();
    if (argv.link) await linkPkgsLifecycle();
  }
  else if (argv.run) {
    await pkgManagementPlanLifecycle();
    await buildPkgsLifecycle();
    await linkPkgsLifecycle();
    await babysit();
  }

  else error('@nodeproto/inception, cmd required') || infoIt(...availScripts);
})();

import chalk from 'chalk';
import path from 'path';
import wtf from '@nodeproto/wtf';
import { inceptionBaseConfig } from '../configs/inception.config.mjs';
import { chokidarConfigDefault } from '../configs/chokidar.config.mjs';
import { ErrorCdBack } from './errors.mjs';

const logger = msgs => console.log.bind(console).apply(null, msgs);
const shelljs = wtf.shelljs;

export const std = {
  log: chalk.bgBlack.bold.whiteBright,
  info: chalk.bgBlack.bold.blueBright,
  warn: chalk.bgBlack.bold.underline.yellow,
  error: chalk.bgBlack.bold.underline.red,
  success: chalk.bgBlack.bold.underline.green,
};

// @see https://github.com/chalk/chalk#colors
// logs should go within a function definition, but not at start / end unless its a utility fn
// info should go at start and end (before return) of function definitions but not if their utility fns
// error any errors
// warn any hickups
// success happy dreams
export const log = (...msgs) => logger([std.log('\n log \n'), ...msgs]);
export const info = (...msgs) => logger([std.info('\n info \n'), ...msgs]);
export const warn = (...msgs) => logger([std.warn('\n warn \n'), ...msgs]);
export const error = (...msgs) => logger([std.error('\n error \n'), ...msgs]);
export const success = (...msgs) => logger([std.success('\n success \n'), ...msgs]);
export const IFS = '||';

const jsonExpected = { scripts: {} };
export const isBuildable = ({ scriptBuild, json = jsonExpected }) => scriptBuild && scriptBuild in json.scripts;
export const isStartable = ({ scriptStart, json = jsonExpected }) => scriptStart && scriptStart in json.scripts;

export const getPkgKey = ({ name, workDir } = {}) => `${workDir}${IFS}${name}`;

// @see https://nodejs.org/api/process.html#process_process_chdir_directory
// +why we're not using process.chdir
export const cdBack = async (toDir, fn, because = 'Running script') => {
  try {
    shelljs.cd(toDir);

    await fn();

    shelljs.cd('-');
  } catch (e) {
    ErrorCdBack('error changing directry or invoking function', { e });
  }

  return true;
};

// not used at the moment
// @see https://stackoverflow.com/questions/37521893/determine-if-a-path-is-subdirectory-of-another-in-node-js
const pkgOf = (path1, path2) => {
  if (path1 === path2) return true;
  const [parent, child] = path1.length > path2.length
    ? [path2, path1]
    : [path1, path2];

  console.log('\n parent:child', parent, child);
  const relative = path.relative(parent, child);

  const response = relative && !relative.startsWith('..') && !path.isAbsolute(relative);
  console.log('\n relative', response, relative, !relative.startsWith('..'), !path.isAbsolute(relative) );

  return response;
};

// not used anymore
// TODO: maybe not needed anymore
const getPkgVersion = pkgName => (
  Array.from(uniquePkgs.values()).filter(pkg => pkg.name === pkgName).pop().inception.version
);

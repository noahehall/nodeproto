import chalk from 'chalk';
import path from 'path';
import shelljs from 'shelljs';
import { inceptionBaseConfig } from '../configs/inception.config.mjs';
import { chokidarConfigDefault } from '../configs/chokidar.config.mjs';

const logger = msgs => console.log.bind(console).apply(null, msgs);

// @see https://github.com/chalk/chalk#colors
// logs should go within a function definition, but not at start / end unless its a utility fn
// info should go at start and end (before return) of function definitions but not if their utility fns
// error any errors
// warn any hickups
// success happy dreams
export const log = (...msgs) => logger([chalk.bgBlack.bold.whiteBright('\n log \n'), ...msgs]);
export const info = (...msgs) => logger([chalk.bgBlack.bold.blueBright('\n info \n'), ...msgs]);
export const warn = (...msgs) => logger([chalk.bgBlack.bold.underline.yellow('\n warn \n'), ...msgs]);
export const error = (...msgs) => logger([chalk.bgBlack.bold.underline.red('\n error \n'), ...msgs]);
export const success = (...msgs) => logger([chalk.bgBlack.bold.underline.green('\n success \n'), ...msgs]);
export const IFS = '||';

export const isBuildable = ({ scriptBuild, inception = { pkgJson: { scripts: {} }}} = {}) => scriptBuild && scriptBuild in inception.pkgJson.scripts;
export const isPushable = pkg => (isBuildable(pkg) && pkg.pushAfterBuild) || pkg.pushWithoutBuild;
export const isStartable = ({ scriptStart, inception = { pkgJson: { scripts: {} }}} = {}) => scriptStart && scriptStart in inception.pkgJson.scripts;

export const getPkgKey = ({ name, workDir } = {}) => `${workDir}${IFS}${name}`;
export const getPkgName = (pkg) => (
`${pkg.inception.pkgJson.name}`
);


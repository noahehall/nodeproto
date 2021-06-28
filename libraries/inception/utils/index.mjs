import path from 'path';
import shelljs from 'shelljs';
import { inceptionBaseConfig } from '../configs/inception.config.mjs';
import { chokidarConfigDefault } from '../configs/chokidar.config.mjs';

const logger = console.log.bind(console);
const warner = console.warn.bind(console);
const errorer = console.error.bind(console);
export const log = (...msgs) => logger.apply(null, ['\ninfo\n', ...msgs]);
export const warn = (...msgs) => warner.apply(null, ['\nwarn\n', ...msgs]);
export const error = (...msgs) => errorer.apply(null, ['\nerror\n', ...msgs]);
export const success = log;
export const info = log;
export const IFS = '||';

export const isBuildable = ({ scriptBuild, inception = { pkgJson: { scripts: {} }}} = {}) => scriptBuild && scriptBuild in inception.pkgJson.scripts;
export const isPushable = pkg => (isBuildable(pkg) && pkg.pushAfterBuild) || pkg.pushWithoutBuild;
export const isStartable = ({ scriptStart, inception = { pkgJson: { scripts: {} }}} = {}) => scriptStart && scriptStart in inception.pkgJson.scripts;

export const getPkgKey = ({ name, workDir } = {}) => `${workDir}${IFS}${name}`;
export const getPkgName = (pkg) => (
`${pkg.inception.pkgJson.name}`//@${pkg.inception.pkgJson.version.replace(/\@|\^|\~/g, '')}`
);


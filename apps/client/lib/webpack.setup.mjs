import { envproto } from '@nodeproto/utils';
import path from 'path';
import pkgJson from '../package.json';

export { builtinModules } from 'module';
export { default as babelConfigDefault } from './babel.config.cjs';

export const context = process.cwd();
export const env = envproto.syncEnvAndConfig(pkgJson);
export const pathDist = path.resolve(context, env.directories.dist);
export const pathSrc = path.resolve(context, env.directories.app);

export const mode = env.config.NODE_ENV;
export const ifDev = mode === 'development';
export const ifProd = mode === 'production';

const prefix = 'error in pack:';
export const throwMsg = msg => { throw new Error(`${prefix} ${msg}`); };

import {
  createEsbuildConfig,
  esbuildPluginPopCopy,
  esbuildPluginPopCopyConfig,
  esrunConfig,
} from '@nodeproto/buildproto/esbuild';
import { dirs, fsproto, resolve } from '@nodeproto/wtf';
import { builtinModules } from 'module';
import path from 'path';

const thisDir = dirs.dirname(import.meta.url);
const outdir = thisDir + '/dist';

const popCopyConfig = esbuildPluginPopCopyConfig({
  endingWith: /openapi\.(yml|yaml)$/,
  indir: path.resolve(thisDir, './src/api/routes'),
  outdir,
});

const configOpts = {
  entry: await resolve('./src/root.mjs', import.meta),
  outdir,
  pkgJson: fsproto.fs.readJsonSync('./package.json'),
  plugins: [esbuildPluginPopCopy(popCopyConfig)],
  builtinModules,
  // removePkgDependencies: false,
  // outExtension: {},
};

/*
SyntaxError: Cannot use 'import.meta' outside a module
    at Object.compileFunction (node:vm:352:18)
    at wrapSafe (node:internal/modules/cjs/loader:1031:15)
    at Module._compile (node:internal/modules/cjs/loader:1065:27)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1153:10)
    at Module.load (node:internal/modules/cjs/loader:981:32)
    at Function.Module._load (node:internal/modules/cjs/loader:822:12)
    at Module.require (node:internal/modules/cjs/loader:1005:19)
    at require (node:internal/modules/cjs/helpers:102:18)
    at Object.<anonymous> (/home/poop/git/foss/nodeproto/packages/libraries/envproto/dist/index.js:1:509)
    at Module._compile (node:internal/modules/cjs/loader:1101:14)
    */
await esrunConfig(createEsbuildConfig(configOpts));

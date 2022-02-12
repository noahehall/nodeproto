// @flow strict

import {
  createEsbuildConfig,
  esbuildConfig,
  esbuildPluginPopCopy,
  esbuildPluginPopCopyConfig,
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
  builtinModules,
  entry: await resolve('./src/root.mjs', import.meta),
  outdir,
  pkgJson: fsproto.fs.readJsonSync('./package.json'),
  plugins: [esbuildPluginPopCopy(popCopyConfig)],
};

await esbuildConfig(createEsbuildConfig(configOpts));

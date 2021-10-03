import {
  createEsbuildConfig,
  esbuildConfig,
  esbuildPluginPopCopy,
  esbuildPluginPopCopyConfig,
} from '@nodeproto/buildproto/esbuild';
import { fsproto, resolve, dirs } from '@nodeproto/wtf';
import { builtinModules } from 'module';
import path from 'path';

const thisDir = dirs.dirname(import.meta.url);
const outdir = path.resolve(thisDir, '../../../dist/esbuild/popcopy');

const popCopyConfig = esbuildPluginPopCopyConfig({
  endingWith: /openapi\.(yml|yaml)$/,
  indir: path.resolve(thisDir, '../../copypasta/node/openapi'),
  outdir,
});

const configOpts = {
  entry: await resolve('../../copypasta/node/api.mjs', import.meta),
  outdir,
  pkgJson: fsproto.fs.readJsonSync(await resolve('../../../package.json', import.meta)),
  plugins: [esbuildPluginPopCopy(popCopyConfig)],
  builtinModules,
};

const config = createEsbuildConfig(configOpts);
// console.info(config.external)
await esbuildConfig(config);

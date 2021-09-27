import {
  createEsbuildConfig,
  esbuildConfig,
  esbuildPluginPopCopy,
  esbuildPluginPopCopyConfig,
} from '@nodeproto/configproto/esbuild';
import { fsproto, isMain, dirs } from '@nodeproto/wtf';
import { builtinModules } from 'module'

const basedir = dirs.dirname(import.meta.url);
const outdir = basedir + '/dist';

console.info('\n\n wtf is outdir', outdir);

const popCopyConfig = esbuildPluginPopCopyConfig({
  endingWith: /openapi\.(yml|yaml)$/,
  indir: basedir + '/src/api',
  outdir,
});

const configOpts = {
  // absWorkingDir: basedir,
  entry: basedir + '/src/root.mjs',
  outdir,
  pkgJson: fsproto.fs.readJsonSync('./package.json'),
  plugins: [esbuildPluginPopCopy(popCopyConfig)],
  builtinModules,
};

await esbuildConfig(createEsbuildConfig(configOpts));
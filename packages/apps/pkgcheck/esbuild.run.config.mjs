import {
  createEsbuildConfig,
  esrunConfig,
  esbuildPluginPopCopy,
  esbuildPluginPopCopyConfig,
} from '@nodeproto/configproto/esbuild';
import { fsproto, isMain, dirs } from '@nodeproto/wtf';
import { builtinModules } from 'module'

const basedir = dirs.dirname(import.meta.url);
const outdir = basedir + '/dist';

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
  // format: 'cjs',
  // outExtension: {},
  // target: ['node16']
};

await esrunConfig(createEsbuildConfig(configOpts));

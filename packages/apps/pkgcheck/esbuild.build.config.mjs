import {
  createEsbuildConfig,
  esbuildConfig,
  esbuildPluginPopCopy,
  esbuildPluginPopCopyConfig,
} from '@nodeproto/configproto/esbuild';
import { fsproto, parentUri, resolve, dirs } from '@nodeproto/wtf';

const basedir = dirs.dirname(import.meta.url);
const outdir = basedir + '/dist';

const popCopyConfig = esbuildPluginPopCopyConfig({
  endingWith: /openapi\.(yml|yaml)$/,
  indir: basedir + '/src/app/api',
  outdir,
});

const configOpts = {
  entry: basedir + '/src/root.mjs',
  outdir,
  pkgJson: fsproto.fs.readJsonSync('./package.json'),
  plugins: [esbuildPluginPopCopy(popCopyConfig)]
};

await esbuildConfig(createEsbuildConfig(configOpts));

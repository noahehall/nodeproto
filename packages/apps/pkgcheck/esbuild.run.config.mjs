import {
  createEsbuildConfig,
  esrunConfig,
  esbuildPluginPopCopy,
  esbuildPluginPopCopyConfig,
} from '@nodeproto/configproto/esbuild';
import { fsproto, parentUri, resolve } from '@nodeproto/wtf/fsproto';

const outdir = await resolve('./dist', parentUri(import.meta));

const popCopyConfig = esbuildPluginPopCopyConfig({
  endingWith: /openapi\.(yml|yaml)$/,
  indir: await resolve('./src', parentUri(import.meta)),
  outdir,
});

const configOpts = {
  entry: await resolve('./src/root.mjs', parentUri(import.meta)),
  outdir,
  pkgJson: fsproto.fs.readJsonSync('./package.json'),
  plugins: [esbuildPluginPopCopy(popCopyConfig)]
};

await esrunConfig(createEsbuildConfig(configOpts));

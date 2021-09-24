import {
  createEsbuildConfig,
  esbuildConfig,
  esbuildPluginPopCopy,
  esbuildPluginPopCopyConfig,
} from '@nodeproto/configproto/esbuild';
import { fsproto, parentUri, resolve } from '@nodeproto/wtf/fsproto';

const outdir = await resolve('../../dist/copypasta/node/nodeFixtures', parentUri(import.meta));

const popCopyConfig = esbuildPluginPopCopyConfig({
  endingWith: /openapi\.(yml|yaml)$/,
  indir: await resolve('../../copypasta/node/openapi', parentUri(import.meta)),
  outdir,
});

const configOpts = {
  entry: await resolve('../../copypasta/node/nodeFixtures.js', parentUri(import.meta)),
  outdir,
  pkgJson: fsproto.fs.readJsonSync('../../package.json'),
  plugins: [esbuildPluginPopCopy(popCopyConfig)]
};

await esbuildConfig(createEsbuildConfig(configOpts));

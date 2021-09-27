import { createEsbuildConfig, esbuildConfig } from '@nodeproto/configproto/esbuild';
import { fsproto, parentUri, resolve } from '@nodeproto/wtf/fsproto';

const configOpts = {
  entry: await resolve('../../copypasta/node/nodeFixtures.cjs', parentUri(import.meta)),
  outdir: await resolve('../../dist/copypasta/node/nodeFixtures', parentUri(import.meta)),
  pkgJson: fsproto.fs.readJsonSync('../../package.json'),
};

await esbuildConfig(createEsbuildConfig(configOpts));

import { createEsbuildConfig, esrunConfig } from '@nodeproto/configproto/esbuild';
import { fsproto, parentUri, resolve } from '@nodeproto/wtf/fsproto';

const configOpts = {
  entry: await resolve('../../copypasta/node/koaHelloWorld.mjs', parentUri(import.meta)),
  outdir: await resolve('../../dist/copypasta/node/koaHelloWorld', parentUri(import.meta)),
  pkgJson: fsproto.fs.readJsonSync('../../package.json'),
};

await esrunConfig(createEsbuildConfig(configOpts));

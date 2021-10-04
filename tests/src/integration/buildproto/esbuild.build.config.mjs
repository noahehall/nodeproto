import { createEsbuildConfig, esbuildConfig } from '@nodeproto/buildproto/esbuild';
import { dirs, fsproto, resolve } from '@nodeproto/wtf';
import path from 'path';

const thisDir = dirs.dirname(import.meta.url);

const configOpts = {
  entry: await resolve('../../copypasta/node/nodeFixtures.cjs', import.meta),
  outdir: path.resolve(thisDir, '../../../dist/esbuild/build'),
  pkgJson: fsproto.fs.readJsonSync(await resolve('../../../package.json', import.meta)),
};

await esbuildConfig(createEsbuildConfig(configOpts));

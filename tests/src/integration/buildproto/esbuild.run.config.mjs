import { createEsbuildConfig, esrunConfig } from '@nodeproto/buildproto/esbuild';
import { fsproto, resolve, dirs } from '@nodeproto/wtf';
import path from 'path';

const thisDir = dirs.dirname(import.meta.url);

const configOpts = {
  entry: await resolve('../../copypasta/node/koaHelloWorld.mjs', import.meta),
  outdir: path.resolve(thisDir, '../../../dist/esbuild/run'),
  pkgJson: fsproto.fs.readJsonSync(await resolve('../../../package.json', import.meta)),
};

await esrunConfig(createEsbuildConfig(configOpts));

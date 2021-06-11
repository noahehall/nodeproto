
import { builtinModules as builtin } from 'module';
import { envproto, esproto } from '@nodeproto/utils/index';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';
import esbuild from 'esbuild';
import fs from 'fs';
import manifestPlugin from 'esbuild-plugin-manifest';
import path from 'path';
import pkgJson from '../package.json';
import util from 'util';

const appInputFilename = 'index';
const appExtension = '.mjs';
const appId = appInputFilename + appExtension;
const manifestFilename = 'manifest.json';
const outdir = path.resolve('dist');
const manifestUri = outdir + '/' + manifestFilename;


const manifestPluginConfig = {
  hash: false,
  shortNames: false,
  extensionless: 'input',
  filename: manifestFilename,
};


const buildLog = ({ errors, warnings, ...result}) => {
  console.info('\n\n finished build\n', Object.keys(result.metafile.outputs))
  if (!errors.length && !warnings.length) return;
  console.warn('\n\n build notifications', { errors, warnings });
};

const esbuildConfig = {
  // conditions: ['browser'],
  assetNames: 'assets/[name]',
  bundle: true,
  define: envproto.syncEnv(pkgJson).processEnv,
  entryNames: '[name]',
  entryPoints: [appId],
  external: builtin,
  metafile: true,
  minify: false,
  outdir,
  outExtension: {'.js': '.cjs'},
  platform: 'node',
  resolveExtensions: ['.mjs', '.js', '.cjs', '.json'],
  sourcemap: true,
  target: ['node14.17.0'], // LTS
  write: true,
  plugins: [
    manifestPlugin(manifestPluginConfig),
  ],
  // format: 'iie',
  // outfile: 'dist/out.cjs',
};


esbuild.build(esbuildConfig).then(result => {
  buildLog(result);
})


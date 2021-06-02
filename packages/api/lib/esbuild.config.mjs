'use strict';

import dotenv from 'dotenv';
import esbuild from 'esbuild';
import fs from 'fs';
import manifestPlugin from 'esbuild-plugin-manifest';
import path from 'path';
import pkgJson from '../package.json';
import popCopy from './esbuild/plugins/popCopy.mjs';
import util from 'util';

// load env
// todo: review when pkjson.config gets complex
const parsed = dotenv.config().parsed;
const buildEnv = Object.entries(parsed)
  .reduce(
    (a, [k, v]) => (a[`process.env.${k}`] = '"' + parsed[k] + '"') && a,
    {}
  );


const readFile = util.promisify(fs.readFile);
const appInputFilename = 'main';
const appExtension = '.mjs';
const appId = appInputFilename + appExtension;
const manifestFilename = 'manifest.json';
const outdir = path.resolve('dist');
const manifestUri = outdir + '/' + manifestFilename;
// for auto starting in dev
let app = undefined;
const stopDev = async () => app && (await app).close();
const startDev = async () => {
  await (stopDev())

  const newApp = await readFile(manifestUri, 'utf-8')
    .then(manifest => import('../' + JSON.parse(manifest)[appInputFilename]));

  app = newApp.runApp();
}

const buildLog = ({ errors, warnings, ...result}) => {
  console.info('\n\n finished build\n', Object.keys(result.metafile.outputs))
  if (!errors.length && !warnings.length) return;
  console.warn('\n\n build notifications', { errors, warnings });

  result.stop();
};

const popCopyConfig = {
  options: [
    {
      indir: (await import.meta.resolve('../app', import.meta.url)).replace('file://', ''),
      outdir,
      endingWith: /openapi\.(yml|yaml)$/,
      recurse: true,
    },
  ],
};

const manifestPluginConfig = {
  hash: false,
  shortNames: false,
  extensionless: 'input',
  filename: manifestFilename,
};


const esbuildConfig = {
  assetNames: 'assets/[name]-[hash]',
  bundle: true,
  define: buildEnv,
  entryNames: '[name]-[hash]',
  entryPoints: [appId],
  // external: Object.keys(process.binding('natives')), // @see https://stackoverflow.com/questions/35725976/how-to-obtain-a-list-of-all-available-node-js-modules
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
    popCopy(popCopyConfig),
    manifestPlugin(manifestPluginConfig),
  ],
  watch: {
    async onRebuild(error, result) {
      buildLog(result);

      if (error) {
        result.stop();
        await stopDev();
        console.error(error);
      }
      else startDev();

    }
  }
  // format: 'iie',
  // outfile: 'dist/out.cjs',
};


esbuild.build(esbuildConfig).then(result => {
  buildLog(result);
  startDev();
})

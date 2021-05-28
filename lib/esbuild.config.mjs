'use strict';

// import { yamlPlugin } from 'esbuild-plugin-yaml';
import babel from 'esbuild-plugin-babel';
import dotenv from 'dotenv';
import esbuild from 'esbuild';
import fs from 'fs';
import jsonschemaPlugin from '@offen/esbuild-plugin-jsonschema';
import manifestPlugin from 'esbuild-plugin-manifest';
import path from 'path';
import util from 'util';
import popCopy from './esbuild/plugins/popCopy.mjs';

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
const outdir = path.resolve('../dist');
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
  entryPoints: [appId],
  entryNames: '[name]-[hash]',
  assetNames: 'assets/[name]-[hash]',
  resolveExtensions: ['.mjs', '.js', '.cjs', '.json'],
  bundle: true,
  write: true,
  platform: 'node',
  sourcemap: true,
  minify: false,
  target: ['node14.17.0'], // LTS
  external: [/*pkgs*/],
  outdir,
  outExtension: {'.js': '.cjs'},
  define: buildEnv,
  metafile: true,
  plugins: [
    // babel(),
    // yamlPlugin(),
    popCopy(popCopyConfig),
    jsonschemaPlugin(),
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

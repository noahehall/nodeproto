'use strict';

import babel from 'esbuild-plugin-babel';
import dotenv from 'dotenv';
import esbuild from 'esbuild';
import fs from 'fs';
import jsonschemaPlugin from '@offen/esbuild-plugin-jsonschema';
import manifestPlugin from 'esbuild-plugin-manifest';
import path from 'path';
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
const manifestUri = 'dist/' + manifestFilename;

// for auto starting in dev
let app = undefined;
const stopDev = async () => app && app.close();
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
}

const manifestPluginConfig = {
  hash: false,
  shortNames: false,
  extensionless: 'input',
  filename: manifestFilename,
}

const esbuildConfig = {
  entryPoints: [appId],
  entryNames: '[name]-[hash]',
  bundle: true,
  write: true,
  platform: 'node',
  sourcemap: true,
  minify: false,
  target: ['node14.17.0'], // LTS
  external: [/*pkgs*/],
  outdir: 'dist',
  outExtension: {'.js': '.cjs'},
  define: buildEnv,
  metafile: true,
  plugins: [
    // babel(),
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

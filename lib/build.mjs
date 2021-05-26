'use strict';

import esbuild from 'esbuild';
import path from 'path';
import pkgJson from '../package.json';
import dotenv from 'dotenv';
import manifestPlugin from 'esbuild-plugin-manifest';
import fs from 'fs';
import util from 'util';

// load env
const parsed = dotenv.config().parsed;
const buildEnv = Object.entries(parsed)
  .reduce(
    (a, [k, v]) => (a[`process.env.${k}`] = '"' + parsed[k] + '"') && a,
    {}
  );


// utils
const startDev = async () => {
  if (app) await app.close();

  const newApp = await readFile(manifestUri, 'utf-8')
    .then(manifest => import('../' + JSON.parse(manifest).main));

  app = newApp.runApp();
}


// fk esm import cache
const readFile = util.promisify(fs.readFile);
const appInputFilename = 'main';
const appExtension = '.mjs';
const appId = appInputFilename + appExtension;
const manifestFilename = 'manifest.json';
const manifestUri = 'dist/' + manifestFilename;



let app = undefined;



const manifestPluginConfig = {
  hash: false,
  shortNames: false,
  extensionless: 'input',
  filename: manifestFilename,
}

const config = {
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
  plugins: [manifestPlugin(manifestPluginConfig)],
  watch: {
    onRebuild(error, results) {
      console.log('\n\n rebuilding')
      if (error) stopDev();
      else startDev();

    }
  }
  // format: 'iie',
  // outfile: 'dist/out.cjs',
};

esbuild.build(config).then(result => {
  // result.stop();
  console.log(Object.keys(result.metafile.inputs[appId]))
  startDev();
})

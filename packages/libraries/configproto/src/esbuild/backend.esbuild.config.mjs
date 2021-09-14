/**
 * @nodeproto/configproto - esbuild config file
 * full featured esbuild configuration for backend apps
 */
import { builtinModules } from 'module';
import { envproto, esproto, fsproto } from '@nodeproto/utils';

import esbuild from 'esbuild';
import fs from 'fs';
import manifestPlugin from 'esbuild-plugin-manifest';
import path from 'path';
import pkgJson from '../package.json';

const appInputFilename = 'index';
const appExtension = '.mjs';
const appId = appInputFilename + appExtension;
const manifestFilename = 'manifest.json';
const outdir = path.resolve('dist');
const manifestUri = outdir + '/' + manifestFilename;

const conditions = process.execArgv.filter(x => x.startsWith('--conditions'));
const isBuild = !!conditions.filter(x => x.endsWith('build')).length;
const isDev = !isBuild; // cant be both dev and build

// for auto starting in dev
let servers = undefined;
const stopDev = async () => isDev && servers?.length && servers.forEach(s => s.close());
const startDev = async () => {
  if (isBuild) return;

  await (stopDev());

  return fs.promises.readFile(manifestUri, 'utf-8')
    .then(manifest => import('../' + JSON.parse(manifest)[appInputFilename]))
    .then(async newServers => {
      if (newServers) servers = await newServers.runApp();

      return servers;
    });
};

const buildLogAndDevOrStop = ({ errors, warnings, ...result }) => {
  console.info('\n\n finished build\n', Object.keys(result.metafile.outputs));

  if (errors.length || warnings.length)
    console.warn('\n\n build notifications', { errors, warnings });

  if (isDev) startDev();
  else if (isBuild) result.stop();
};

const popCopyConfig = {
  options: [
    {
      endingWith: /openapi\.(yml|yaml)$/,
      indir: (await fsproto.resolve('../app', import.meta.url)).replace('file://', ''),
      outdir,
      recurse: true,
    },
  ],
};

const manifestPluginConfig = {
  extensionless: 'input',
  filename: manifestFilename,
  hash: false,
  shortNames: false,
};

// const env = envproto.syncEnv(pkgJson);

// console.log('\n\n got env', env);

const esbuildConfig = {
  assetNames: 'assets/[name]-[hash]',
  bundle: true,
  define: envproto.syncEnv(pkgJson).processEnv,
  entryNames: isDev ? '[name]-[hash]' : '[name]',
  entryPoints: [appId],
  external: builtinModules,
  metafile: true,
  minify: false,
  outdir,
  outExtension: { '.js': '.cjs' },
  platform: 'node',
  plugins: [ esproto.popCopy(popCopyConfig), manifestPlugin(manifestPluginConfig) ],
  resolveExtensions: ['.mjs', '.js', '.cjs', '.json'],
  sourcemap: true,
  target: ['node14.17.0'], // LTS
  watch: {
    async onRebuild(error, result) {
      buildLogAndDevOrStop(result);

      if (error) console.error(error);
    }
  },
  write: true,
  // format: 'iie',
  // outfile: 'dist/out.cjs',
};


const buildResult = await esbuild.build(esbuildConfig);
isBuild && buildLogAndDevOrStop(buildResult); // isDev handled by watch.onRebuild

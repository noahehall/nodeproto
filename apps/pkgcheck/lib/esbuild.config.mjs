import { envproto, esproto, fsproto } from '@nodeproto/utils';
import esbuild from 'esbuild';
import fs from 'fs';
import manifestPlugin from 'esbuild-plugin-manifest';
import path from 'path';
import pkgJson from '../package.json';
import { builtinModules } from 'module';

const appInputFilename = 'index';
const appExtension = '.mjs';
const appId = appInputFilename + appExtension;
const manifestFilename = 'manifest.json';
const outdir = path.resolve('dist');
const manifestUri = outdir + '/' + manifestFilename;

const conditions = process.execArgv.filter(x => x.startsWith('--conditions'));
const isBuild = !!conditions.filter(x => x.endsWith('build')).length
const isDev = !isBuild; // cant be both dev and build


// for auto starting in dev
let servers = undefined;
const stopDev = async () => isDev && servers?.length && servers.forEach(s => s.close());
const startDev = async () => {
  if (isBuild) return;

  await (stopDev())

  const newServers = await fs.promises.readFile(manifestUri, 'utf-8')
    .then(manifest => import('../' + JSON.parse(manifest)[appInputFilename]))

  if (newServers) servers = await newServers.runApp();
}

const buildLogAndDevOrStop = ({ errors, warnings, ...result}) => {
  console.info('\n\n finished build\n', Object.keys(result.metafile.outputs));

  if (errors.length || warnings.length)
    console.warn('\n\n build notifications', { errors, warnings });

  if (isDev) startDev();
  else if (isBuild) result.stop();
};

const popCopyConfig = {
  options: [
    {
      indir: (await fsproto.resolve('../app', import.meta.url)).replace('file://', ''),
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
  outExtension: {'.js': '.cjs'},
  platform: 'node',
  resolveExtensions: ['.mjs', '.js', '.cjs', '.json'],
  sourcemap: true,
  target: ['node14.17.0'], // LTS
  write: true,
  plugins: [
    esproto.popCopy(popCopyConfig),
    manifestPlugin(manifestPluginConfig),
  ],
  watch: {
    async onRebuild(error, result) {
      buildLogAndDevOrStop(result);

      if (error) console.error(error);
    }
  }
  // format: 'iie',
  // outfile: 'dist/out.cjs',
};


const buildResult = await esbuild.build(esbuildConfig);
isBuild && buildLogAndDevOrStop(buildResult); // isDev handled by watch.onRebuild



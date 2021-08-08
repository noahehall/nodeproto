
import { builtinModules as builtin } from 'module';
import { syncEnv } from '@nodeproto/envproto';
import esbuild from 'esbuild';
import manifestPlugin from 'esbuild-plugin-manifest';
import path from 'path';
import { fs } from '@nodeproto/wtf';

const pkgJson = fs.readJsonSync('package.json');

// syncEnv(pkgJson);

throw process

const appInputFilename = 'index';
const appExtension = '.mjs';
const appId = appInputFilename + appExtension;
const manifestFilename = 'manifest.json';
const outdir = path.resolve('dist');

const manifestPluginConfig = {
  extensionless: 'input',
  filename: manifestFilename,
  hash: false,
  shortNames: false,
};

const buildLog = ({ errors, warnings, ...result }) => {
  console.info(
    '\n\n finished build\n',
    Object.keys(result.metafile.outputs)
  )
  if (!errors.length && !warnings.length) return;
  console.warn(
    '\n\n build notifications',
    { errors, warnings }
  );
};

const esbuildConfig = {
  // conditions: ['browser'],
  assetNames: 'assets/[name]',
  bundle: true,
  define: syncEnv(pkgJson).processEnv,
  entryNames: '[name]',
  entryPoints: [appId],
  external: builtin,
  metafile: true,
  minify: false,
  outdir,
  outExtension: { '.js': '.cjs' },
  platform: 'node',
  resolveExtensions: [
    '.mjs',
    '.js',
    '.cjs',
    '.json'
  ],
  sourcemap: true,
  target: ['node14.17.4'], // LTS
  // format: 'esm',
  write: true,
  plugins: [manifestPlugin(manifestPluginConfig)],
  // format: 'iie',
  // outfile: 'dist/out.cjs',
};

esbuild.build(esbuildConfig).then(result => {
  buildLog(result);
})

import manifestPlugin from 'esbuild-plugin-manifest';

const r = (t, msg = 'is required') => { throw new Error(`${t}: ${msg}`)};

export function createEsbuildConfig ({
  entry = r('entry: string'),
  outdir = r('outdir: string'), // fsproto.resolve('dist')
  pkgJson = r('pkgJson: json'),

  // defaults
  assetNames = 'assets/[name]-[hash]',
  builtinModules = [], // import { builtinModules } from 'module';
  bundle = true,
  isBuild = process.env.IS_BUILD,
  isDev = process.env.NODE_ENV !== 'production',
  isProd = !isDev,
  manifestFilename = 'manifest.json',
  metafile = true,
  outExtension = { '.js': '.cjs' },
  platform = 'node',
  plugins = [/*popCopy(popCopyConfig),*/],
  replaceEntryVars = {}, // passed to define
  resolveExtensions = ['.mjs', '.js', '.cjs', '.json'],
  sourcemap = true,
  target = ['node14.17.0'], // LTS
  watch = false,
  bff = false, // starts server
  write = true,

  // dependent
  entryNames = isDev ? '[name]-[hash]' : '[name]',
  minify = isProd,

  ...overrides
}) {
  const lastPeriod = entry.lastIndexOf('.');
  const appInputFilename = entry.slice(0, lastPeriod);
  const appExtension = entry.slice(lastPeriod);
  const manifestUri = outdir + '/' + manifestFilename;

  const define = {
    // TODO: create example of using envproto with configproto
    // ^ we cannot have cyclic dependencies
    // ...envproto.syncEnvWithConfig(pkgJson).processEnv,
    ...replaceEntryVars
  };

  const manifestPluginConfig = {
    extensionless: 'input',
    filename: manifestFilename,
    hash: isProd,
    shortNames: false,
  };

  return {
    assetNames,
    bundle,
    define,
    entryNames,
    entryPoints: [entry],
    external: builtinModules,
    metafile,
    minify,
    outdir,
    outExtension,
    platform,
    plugins: plugins.concat(
      manifestPlugin(manifestPluginConfig),
    ),
    resolveExtensions,
    sourcemap,
    target,
    watch: false,
    write,

    ...overrides
  };
}
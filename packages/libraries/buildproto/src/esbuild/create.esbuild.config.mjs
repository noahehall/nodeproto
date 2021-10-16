// $FlowTODO

import manifestPlugin from "esbuild-plugin-manifest";

const r = (t, msg = "is required") => {
  throw new Error(`${t}: ${msg}`);
};

const getPkgDeps = (pkgJson) =>
  Object.keys({
    ...(pkgJson.dependencies || {}),
    ...(pkgJson.devDependencies || {}),
  });

// @see https://esbuild.github.io/api/
export function createEsbuildConfig({
  entry = r("entry: string"),
  outdir = r("outdir: string"), // fsproto.resolve('dist')
  pkgJson = r("pkgJson: json"),

  // defaults
  assetNames = "assets/[name]-[hash]",
  bff = false, // starts server
  builtinModules = [], // import { builtinModules } from 'module';
  bundle = true,
  external = [], // generally you shouldnt package your deps
  isBuild = process.env.IS_BUILD,
  isDev = process.env.NODE_ENV !== "production",
  isProd = !isDev,
  manifestFilename = "manifest.json",
  metafile = true,
  outExtension = { ".js": ".cjs" },
  platform = "node",
  plugins = [],
  removePkgDependencies = false,
  replaceEntryVars = {}, // passed to define
  resolveExtensions = [".mjs", ".js", ".cjs", ".json"],
  sourcemap = true,
  target = ["node14"], // LTS
  watch = false,
  write = true,

  // dependent
  entryNames = isDev ? "[name]-[hash]" : "[name]",
  minify = isProd,

  ...overrides
}) {
  const lastPeriod = entry.lastIndexOf(".");
  const appInputFilename = entry.slice(0, lastPeriod);
  const appExtension = entry.slice(lastPeriod);
  const manifestUri = outdir + "/" + manifestFilename;

  const define = {
    // TODO: create example of using envproto with configproto
    // ^ we cannot have cyclic dependencies
    // ...envproto.syncEnvWithConfig(pkgJson).processEnv,
    ...replaceEntryVars,
  };

  const manifestPluginConfig = {
    extensionless: "input",
    filename: manifestFilename,
    hash: isProd,
    shortNames: false,
  };

  return {
    assetNames,
    bundle, // inline any imported dependencies into the file itself;
    define, // This feature provides a way to replace global identifiers with constant expressions.
    entryNames,
    entryPoints: [entry],
    external: external
      .concat(builtinModules)
      .concat(removePkgDependencies ? getPkgDeps(pkgJson) : []),
    metafile,
    minify, // the generated code will be minified instead of pretty-printed
    outdir,
    outExtension,
    platform,
    plugins: plugins.concat(manifestPlugin(manifestPluginConfig)),
    preserveSymlinks: false,
    resolveExtensions,
    sourcemap,
    target,
    watch,
    write,

    ...overrides,
  };
}

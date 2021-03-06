// @flow

// creates an esbuild configuration object for bundling a node apps source files
// hard requirements on the latest node LTS and esm

import manifestPlugin from 'esbuild-plugin-manifest';
import { throwIt } from '@nodeproto/shared';

import { pack } from '../pack';

import type {
  BaseEsbuildType,
  EsbuildConfigType,
  NodeprotoPackType
} from '../libdefs';

// @see https://esbuild.github.io/api/
export const baseEsbuildConfig = async ({
  assetNames = 'assets/[name]-[hash]',
  bundle = true,
  context,
  entry,
  external = [], // generally you shouldnt package your deps
  format = 'esm',
  manifestFilename = 'manifest.json',
  metafile = true,
  NODE_ENV,
  PATH_DIST,
  PATH_SRC,
  platform = 'node',
  plugins = [],
  replaceEntryVars = {}, // passed to define
  resolveExtensions = ['.mjs', '.js', '.cjs', '.json'],
  target = ['node16.14.0'],
  watch = false,
  write = true,

  ...rest
}: BaseEsbuildType): Promise<{ config: EsbuildConfigType, pack: NodeprotoPackType}> => {
  if (typeof entry !== 'string' && !Array.isArray(entry)) throwIt('entry is required');

  const meta = await pack({ context, NODE_ENV, PATH_DIST, PATH_SRC, writeToDisk: write });

  const define = {
    // TODO: create example of using envproto with configproto
    // ^ we cannot have cyclic dependencies
    // ...envproto.syncEnvWithConfig(pkgJson).processEnv,
    ...replaceEntryVars,
  };

  const manifestPluginConfig = {
    extensionless: 'input',
    filename: manifestFilename,
    hash: meta.ifProd,
    shortNames: false,
  };

  const config = Object.assign(
    {},
    rest,
    {
      assetNames,
      bundle, // inline any imported dependencies into the file itself;
      define, // This feature provides a way to replace global identifiers with constant expressions.
      entryNames: meta.ifDev ? '[name]-[hash]' : '[name]',
      entryPoints: Array.isArray(entry) ? entry : [entry],
      external: external.concat('./node_modules/*'),
      metafile,
      minify: meta.ifProd, // the generated code will be minified instead of pretty-printed
      outdir: meta.pathDist,
      platform,
      plugins: plugins.concat(manifestPlugin(manifestPluginConfig)),
      preserveSymlinks: false,
      resolveExtensions,
      sourcemap: meta.ifDev,
      target,
      watch,
      write,
    },
  );

  return Object.freeze({ config, pack: meta });
};

// @flow

// creates an esbuild configuration object for bundling a node apps source files
// hard requirements on the latest node LTS and esm

// easy to forget stuff
// bundling: takes an input file, inlines all statically imported deps (that arent externalized) and outputs a single file
// ^ asynchronous imports need to be marked as external, and made available in the runtime environment
// concateting: passing multiple input files will create multiple bundles
// external
// ^ require for the iife and cjs formats, import for the esm format
// ^ can use * as wildcard path to mark entire filepaths as external
// ^^ both before & after path resolution,
// ^^ import path in sourcecode, e.g. @foo/bar/* or /somedir/*
// ^^ absolute filepath of the resolved file, e.g. ./node_modules/*

import manifestPlugin from 'esbuild-plugin-manifest';
import { throwIt } from '@nodeproto/shared';

import { pack } from '../pack';

import type {
  BaseEsbuildType,
  EsbuildConfigType,
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
}: BaseEsbuildType): Promise<EsbuildConfigType> => {
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

  return Object.freeze(Object.assign(
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
  ));
};

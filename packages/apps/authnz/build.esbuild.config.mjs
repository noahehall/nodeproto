// @flow

import {
  baseEsbuildConfig,
  esbuildCompileConfig,
  esbuildPluginPopCopy,
  esbuildPluginPopCopyConfig,
} from '@nodeproto/buildproto';

import { resolve } from '@nodeproto/wtf';

// frigging eslint-flowtype-errors doesnt like top-level await
(async () => {
  const popCopyConfig = esbuildPluginPopCopyConfig({
    endingWith: /openapi\.(yml|yaml)$/,
    indir: await resolve('./src/api/routes'),
    outdir: await resolve('./dist'),
  });

  const configOpts = {
    entry: await resolve('./src/root.mjs'),
    plugins: [esbuildPluginPopCopy(popCopyConfig)],
  };

  const esbuildArtifacts = await baseEsbuildConfig(configOpts);

  await esbuildCompileConfig(esbuildArtifacts.config);
})();

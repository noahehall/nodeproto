// @flow

import {
  baseEsbuildConfig,
  esbuildCompileConfig,
  esbuildPluginPopCopy,
  esbuildPluginPopCopyConfig,
} from '@nodeproto/buildproto';

import { resolve } from '@nodeproto/wtf';
import { throwIt } from '@nodeproto/shared';

// frigging eslint-flowtype-errors doesnt like top-level await
(async () => {
  const indir = await resolve('./src/routers');
  const outdir = await resolve('./dist');

  if (!indir || !outdir) return throwIt(`both indir & outdir reuqired in popcopy`);

  const entry = await resolve('./src/root.mjs');

  if (!entry) return throwIt(`entry required in to build esbuild config`);

  const popCopyConfig = esbuildPluginPopCopyConfig({
    endingWith: /openapi\.(yml|yaml)$/,
    indir,
    outdir,
  });

  const configOpts = {
    entry,
    plugins: [esbuildPluginPopCopy(popCopyConfig)],
  };

  const esbuildArtifacts = await baseEsbuildConfig(configOpts);

  await esbuildCompileConfig(esbuildArtifacts.config);
})();

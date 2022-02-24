// @flow

import {
  baseEsbuildConfig,
  esbuildCompileConfig,
  EsbuildPluginPopCopy,
} from '@nodeproto/buildproto';

import { resolve } from '@nodeproto/wtf';
import { throwIt } from '@nodeproto/shared';

// frigging eslint-flowtype-errors doesnt like top-level await
(async () => {
  const entry = await resolve('./src/root.mjs');

  if (!entry) return throwIt(`entry required in to build esbuild config`);

  const configOpts = {
    entry,
    plugins: [new EsbuildPluginPopCopy({ filter: /openapi\.(yml|yaml)$/ })],
  };

  const esbuildArtifacts = await baseEsbuildConfig(configOpts);

  await esbuildCompileConfig(esbuildArtifacts.config);
})();

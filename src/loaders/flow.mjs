// @see https://nodejs.org/api/esm.html#esm_loaders
// @see https://nodejs.org/api/esm.html#esm_transpiler_loader
// use flow-remove-types | flow-bin ?

import { execFile } from 'child_process';
import flow from 'flow-bin';
// import flowRemoveTypes from 'flow-remove-types'; TODO: should we remove flow types?

export async function transformSource(
  source,
  context,
  defaultTransformSource
) {
  const { url, format } = context;

  if (source.includes('// @flow')) {
    execFile(flow, ['check', url.replace('file://', '')], (err, stdout) => {
      console.log(stdout);
    });
  }

  // Defer to Node.js for all other sources.
  return defaultTransformSource(source, context, defaultTransformSource);
}

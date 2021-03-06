// @FlowTODO
// only for node LTS 16

// @see https://nodejs.org/api/esm.html#esm_loaders
// @see https://nodejs.org/api/esm.html#esm_transpiler_loader

import { execFile } from 'child_process';
import flow from 'flow-bin';
import flowRemoveTypes from 'flow-remove-types';

/**
 * for node < 17
 * in 17 they changed the contract
 */
export async function transformSource(source, context, defaultTransformSource) {
  const { url, format } = context;

  if (source.includes('@flow')) {
    // TODO: this shit should be color printed to console
    if (process.env.FLOW_CHECK)
      execFile(flow, ['check', url.replace('file://', '')], (err, stdout) => {
        console.info(stdout);
      });

    return { source: Buffer.from(flowRemoveTypes(source.toString()).toString()) };
  }

  // Defer to Node.js for all other sources.
  return defaultTransformSource(source, context, defaultTransformSource);
}

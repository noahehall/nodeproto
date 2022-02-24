// logic for node:v17+ -----------------
// @see https://nodejs.org/api/esm.html#esm_loaders
// @see https://nodejs.org/api/esm.html#esm_transpiler_loader
// @see https://nodejs.org/api/esm.html#loadurl-context-defaultload

import { cwd } from 'node:process';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';

import flow from 'flow-bin';
import flowRemoveTypes from 'flow-remove-types';

export async function resolve(specifier, context, defaultResolve) {
  // console.info('\n\n wtf', specifier, context);

  return defaultResolve(specifier, context, defaultResolve);
}

// removes flow types from .mjs files
// TODO: we are now responsible for validating importAssertions
// ^ see esm_loaders link above
export async function load(url, context, defaultLoad) {
  // console.info('\n\n @nodeproto: examing file', context, url);

  if (context.format !== 'module') return defaultLoad(url, context, defaultLoad);

  const { source } = await defaultLoad(url, context);

  const rawSource = source.toString();
  const first100chars = rawSource.substring(0, 100).toLowerCase();

  const isFlow = first100chars.includes('@flow') && !first100chars.includes('@flowtodo');

  if (!isFlow) return defaultLoad(url, context);

  // console.info('\n@nodeproto: removing flow types', url);

  // check types before transpiling
  if (process.env.FLOW_CHECK)
    execFile(flow, ['check', fileURLToPath(url)], (err, stdout) => {
      console.info(stdout);
    });

  // console.info('\n\nsource being returned\n\n', url, flowRemoveTypes(rawSource).toString());

  return {
    format: context.format,
    source: Buffer.from(flowRemoveTypes(rawSource).toString()),
  };
}

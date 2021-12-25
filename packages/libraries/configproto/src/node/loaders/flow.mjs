import { cwd } from 'node:process';
import { dirname, resolve } from 'node:path';
import { execFile } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { readFile } from 'node:fs/promises';

import flow from 'flow-bin';
import flowRemoveTypes from 'flow-remove-types';

// logic for node:v17+ -----------------
// @see https://nodejs.org/api/esm.html#esm_loaders
// @see https://nodejs.org/api/esm.html#esm_transpiler_loader
// @see https://nodejs.org/api/esm.html#loadurl-context-defaultload

const baseURL = pathToFileURL(`${cwd()}/`).href;
const extensionsRegex = /\.js$|\.cjs$|\.mjs|\.jsx$/;

async function getPackageType(url) {
  let filePath;
  try {
    // errors on directories
    filePath = fileURLToPath(url);
  } catch (err) {} // eslint-disable-line no-empty

  const dir = filePath ? dirname(filePath) : url;

  const packagePath = resolve(dir, 'package.json');

  const type = await readFile(packagePath, { encoding: 'utf8' })
    .then(filestring => JSON.parse(filestring).type)
    .catch(err => {
      if (err?.code !== 'ENOENT') console.error(err);
    });
  if (type) return type;

  return dir.length > 1 && getPackageType(resolve(dir, '..'));
}

export async function load(url, context, defaultLoad) {
  // console.info('\n\n @nodeproto: examing file', url);

  if (url.includes('node_modules')) return defaultLoad(url, context, defaultLoad);

  const format = await getPackageType(url);

  const source = (await defaultLoad(url, { format })).source;

  const rawSource = source.toString();
  const first100chars = rawSource.substring(0, 100).toLowerCase();

  const isFlow = first100chars.includes('@flow') && !first100chars.includes('@flowtodo');
  const isCjs = first100chars.includes('import') ? false : first100chars.includes('require(');

  // saving for debugging
  // console.info('\n\n custom logic', {
  //   format,
  //   isCjs,
  //   isFlow,
  //   url,
  // });

  if (!isFlow) return isCjs ? { format, source: rawSource } : defaultLoad(url, { format });

  console.info('\n\n @nodeproto: removing flow types');

  // check types before transpiling
  if (process.env.FLOW_CHECK)
    execFile(flow, ['check', fileURLToPath(url)], (err, stdout) => {
      console.info(stdout);
    });

  return {
    format,
    source: Buffer.from(flowRemoveTypes(rawSource).toString()),
  };
}

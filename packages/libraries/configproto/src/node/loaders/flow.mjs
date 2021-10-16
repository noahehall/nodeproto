import { dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { cwd } from 'node:process';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';

import flow from 'flow-bin';
import flowRemoveTypes from 'flow-remove-types';

// logic for node:v17+ -----------------
// @see https://nodejs.org/api/esm.html#esm_loaders
// @see https://nodejs.org/api/esm.html#esm_transpiler_loader
// @see https://nodejs.org/api/esm.html#loadurl-context-defaultload

const baseURL = pathToFileURL(`${cwd()}/`).href;
const extensionsRegex = /\.js$|\.cjs$|\.mjs|\.jsx$/;

// copypasta: see links
async function getPackageType(url) {
  // TODO: (noah) this is wrong, create ticket in node
  // wtf is url /somerootpath/nodeproto/node_modules/.pnpm/uvu@0.5.2 true
  // const isFilePath = !!extname(url);
  let filePath;
  try {
    // errors on directories? hacky way but it works ;)
    filePath = fileURLToPath(url);
    // @see https://www.technicalkeeda.com/nodejs-tutorials/how-to-check-if-path-is-file-or-directory-using-nodejs
    // ^ but not needed; see prior comment
    // isFile = statSync(filePath).isFile();
  } catch (err) {
    console.error('\n\n error checking filepath', err);
  }

  const dir = filePath ? dirname(filePath) : url;

  const packagePath = resolvePath(dir, 'package.json');

  const type = await readFile(packagePath, { encoding: 'utf8' })
    .then(filestring => JSON.parse(filestring).type)
    .catch(err => {
      if (err?.code !== 'ENOENT') console.error(err);
    });
  if (type) return type;

  return dir.length > 1 && getPackageType(resolvePath(dir, '..'));
}

export async function load(urlOG, context, defaultLoad) {
  const url = urlOG.replace('file:////', 'file:///');

  console.info('\n\n i made it in', url);

  if (url.includes('node_modules')) return defaultLoad(url, context, defaultLoad);

  const format = await getPackageType(url);
  const source = (await defaultLoad(url, { format })).source;

  const rawSource = source.toString();
  const first100chars = rawSource.substring(0, 100).toLowerCase();

  const isFlow = first100chars.includes('@flow') && !first100chars.includes('@flowtodo');
  const isCjs = first100chars.includes('import') ? false : first100chars.includes('require(');

  console.info('\n\n custom logic', { url, isCjs, isFlow });

  if (!isFlow) {
    if (isCjs) return { format, source: rawSource };
    // @see https://stackoverflow.com/questions/12711584/how-to-specify-a-local-file-within-html-using-the-file-scheme
    // ^ file://ip|hostname/path/to/file.js
    // fails here: TypeError [ERR_INVALID_FILE_URL_HOST]: File URL host must be "localhost" or empty on linux
    /*
      (node:559817) WARNING: Exited the environment with code 1
      at exit (node:internal/process/per_thread:189:13)
      at /.../nodeproto/node_modules/.pnpm/uvu@0.5.2/node_modules/uvu/bin.js:32:12
      ^ this whole fkn thing might be a problem with uvu + node17 + linux
      # ^^ confirmed: as pnpm build works, but pnpm repo:test fails
    */ else return defaultLoad(url, { format });
  }

  console.info('\n\n transpiling');

  // check types before transpiling
  const filePath = fileURLToPath(url); // url.replace('file://', '')
  if (process.env.FLOW_CHECK)
    execFile(flow, ['check', filePath], (err, stdout) => {
      console.info(stdout);
    });

  console.info('\n\n returning transpiled source');
  return {
    format,
    source: Buffer.from(flowRemoveTypes(rawSource).toString()),
  };
}

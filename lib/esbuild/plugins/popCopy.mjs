'use strict';
/**
 * @see https://www.youtube.com/watch?v=zR7LOtMix9w
 *
 * popCopy esbuild plugin
 * copies files synchronously before EACH build into the output directory
 * caches results: incremental builds > than initial
 *
 * @see https://nodejs.org/api/fs.html#fs_fs_existssync_path
 * @see https://nodejs.org/api/fs.html#fs_fs_copyfilesync_src_dest_mode
 * @see https://nodejs.org/api/fs.html#fs_fs_mkdirsync_path_options
 * @see https://nodejs.org/api/fs.html#fs_fs_opendirsync_path_options
 * @see https://nodejs.org/api/fs.html#fs_fs_readdirsync_path_options
 */

import fs from 'fs';
import path from 'path';

// cache mapping { filepath: { input, output} }
// for us to return the previous output if the input hasnt change
// ALWAYS use the filepath as key
// @see https://esbuild.github.io/plugins/#caching-your-plugin
const cache = new Map();


// fileShouldCopy(path) => lastModified in MS or undefined
export const fileShouldCopy = sourcepath => {
  try {
    const stat = fs.statSync(sourcepath);
    const cacheMs = cache.get(sourcepath)?.ms;

    return (cacheMs !== stat.mtimeMs) && stat.mtimeMs
  } catch (e) {
    cache.delete(sourcepath);
    console.warn('error accessing file, removing from cache\n', {sourcepath, e});
  }
};

// copy file into specified outdir && caches file time in ms
export const fileCopy = (sourcepath, outdir) => {
  try {
    const cacheMs = fileShouldCopy(sourcepath);
    if (cacheMs) {
      const outpath = `${outdir}/${path.basename(sourcepath)}`;
      cache.set(sourcepath, { ms: cacheMs, outpath });
      fs.copyFileSync(sourcepath, outpath);
      console.info('\n\n popCopy: copied file\n', outpath)
    }
  } catch (e) {
    cache.delete(sourcepath);
    console.warn('\n\n error copying file into outdir', {sourcepath, e});
  }
};


// searches for files to copy
// sets filepaths as keys in cache
export const filesToCopy = options => {
  const msg = 'not copying files:';

  if (!options.length) return console.warn(`${msg} options empty`, options);

  try {
    options.forEach(({ outdir, endingWith, indir, recurse, ...opts }) => {
      if (
        !endingWith instanceof RegExp
        || (!indir || !indir.startsWith('/'))
        || (!outdir || !outdir.startsWith('/'))
      )
        return console.warn(
        `${msg} invalid params`,
        {outdir, endingWith, indir, endingWith}
      );

      const sourcedirs = fs.readdirSync(indir, { encoding: 'utf8', withFileTypes: true }) ?? [];

        sourcedirs.forEach(dirEnt => {
          // check all child-dirs
          // need to check dirEnt[symbol] type === 2
          // because duh files without extensions
        if (!dirEnt.name.includes('.') && recurse) filesToCopy([
            {
              outdir,
              endingWith,
              recurse,
              indir: `${indir}/${dirEnt.name}`,
              ...opts
            }
          ]);
        else {
          // check if filename endsWith regex
          if (endingWith.test(dirEnt.name)) {
            // check if files should be copied
            const sourcepath = `${indir}/${dirEnt.name}`;
            const outpath = `${outdir}/${dirEnt.name}`;
            cache.set(sourcepath, { ms: null, outpath })
          }
        }
      });
    });
  } catch (e) {
    console.warn(`${msg} error in popCopy`, e);
  }
};


const name = 'popCopyPlugin';

export default function popCopy (config) {
  popCopy.options = config;
  popCopy.onStarted = false;

  return {
    name,
    setup (build) {
      /**
       * options
       * { options: [{ indir, endingWith, recurse, outdir }]}
       * @example
       *          finds all files endingWith /openapi\.(yml|yaml)$/
       *          and copies them into esbuild.config.outdir
       *          { options: [{
       *              indir: '/absolute/path',
       *              outdir: /absolute/path'
       *              endingWith: /openapi\.(yml|yaml)$/,
       *              recurse: true,
       *          }]}
       */
      const { options } = popCopy.options ?? {};
      if (!options) return;

      // STEP 1
      // retrieve asset directories from options
      // scan each dir for files matching provided regex
      // for each file found run cache.set(filePath, undefined)
      filesToCopy(options);

      build.onResolve(
        {filter: /^popcopy$/},
        () => ({})
      );
      // @see https://esbuild.github.io/plugins/#start-callbacks
      build.onStart(() => {
        if (popCopy.onStarted) return;
        popCopy.onStarted = true
        // STEP 2
        // loop cache and copy files if necessary

        if (cache.size) for (const [sourcepath, { ms, outpath }] of cache) {
          try {
            const ms = fileShouldCopy(sourcepath);
            if (ms) fileCopy(sourcepath, path.dirname(outpath));
          } catch (e) {
            console.warn('popCopy.onStart error', e);
          }
        }

        return;
      });

      // @see https://esbuild.github.io/plugins/#end-callbacks
      build.onEnd(result => {
        popCopy.onStarted = false;
        return;
      });
    },
  };
};

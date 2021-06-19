
/**
 * @see https://www.youtube.com/watch?v=zR7LOtMix9w
 *
 * popCopy esbuild plugin
 * copies files synchronously before EACH build into the output directory
 * caches results: incremental builds > than initial
 *
 * TODO: https://esbuild.github.io/api/#incremental
 * implement watching yaml files
 */

// import fs from 'fs';
import fs from 'fs'
import path from 'path';

// cache mapping { filepath: { input, output} }
// for us to return the previous output if the input hasnt change
// ALWAYS use the filepath as key
// @see https://esbuild.github.io/plugins/#caching-your-plugin
export const cache = new Map();

// fileShouldCopy(path) => lastModified in MS or undefined
export const fileShouldCopy = async sourcepath => {
  let fd;
  try {
    fd = await fs.promises.open(
      sourcepath,
      'r'
    );
    if (!fd) return;

    const { mtimeMs } = await fd.stat();
    const cacheMs = cache.get(sourcepath)?.ms;
    fd.close();
    return (!cacheMs || (cacheMs < mtimeMs)) && mtimeMs
  } catch (e) {
    console.warn(
      'error accessing file, removing from cache\n',
      { sourcepath, e }
    );
    fd?.close();
    cache.delete(sourcepath);

    return false;
  }
};

// copy file into specified outdir && caches file time in ms
export const fileCopy = async (newCacheMs, sourcepath, outdir) => {
  try {
    if (newCacheMs) {
      const outpath = `${outdir}/${path.basename(sourcepath)}`;
      cache.set(
        sourcepath,
        { ms: newCacheMs, outpath }
      );

      await fs.promises.mkdir(
        outdir,
        { recursive: true }
      )
      await fs.promises.copyFile(
        sourcepath,
        outpath
      ); // dont catch let it throw
    }
  } catch (e) {
    cache.delete(sourcepath);
    console.warn(
      '\n\n error copying file into outdir',
      { sourcepath, e }
    );
  }
};

// searches for files to copy
// sets filepaths as keys in cache
export const filesToCopy = options => {
  const msg = 'not copying files:';

  if (!options.length) {
    return console.warn(
`${msg} options empty`,
options
    );
  }

  options.forEach(async ({ outdir, endingWith, indir, recurse, ...opts }) => {
    try {
      if (
        !(endingWith instanceof RegExp) ||
        (!indir || !indir.startsWith('/')) ||
        (!outdir || !outdir.startsWith('/'))
      ) {
        return console.warn(
        `${msg} invalid params`,
        { outdir, endingWith, indir, recurse, opts }
        );
      }

      const sourcedirs = await fs.promises.readdir(
        indir,
        { encoding: 'utf8', withFileTypes: true }
      ) ?? [];

      sourcedirs.forEach(dirEnt => {
        // check all child-dirs
        // need to check dirEnt[symbol] type === 2
        // because duh files without extensions
        if (!dirEnt.name.includes('.') && recurse) {
          filesToCopy([
            {
              outdir,
              endingWith,
              recurse,
              indir: `${indir}/${dirEnt.name}`,
              ...opts
            }
          ]);
        } else {
          // check if filename endsWith regex
          if (endingWith.test(dirEnt.name)) {
            // check if files should be copied
            const sourcepath = `${indir}/${dirEnt.name}`;
            const outpath = `${outdir}/${dirEnt.name}`;
            cache.set(
              sourcepath,
              { ms: null, outpath }
            )
          }
        }
      });
    } catch (e) {
      console.error(
        '\n\n error in popcopy',
        e
      );
    }
  });
};

const name = 'popCopyPlugin';

export function popCopy (config) {
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
        { filter: /^popcopy$/ },
        () => ({})
      );
      // @see https://esbuild.github.io/plugins/#start-callbacks
      build.onStart(async () => {
        if (popCopy.onStarted) return;
        popCopy.onStarted = true;

        // STEP 2
        // loop cache and copy files if necessary
        if (cache.size) {
          for (const [
            sourcepath,
            { ms, outpath }
          ] of cache) {
            try {
              const newCacheMs = await fileShouldCopy(sourcepath);
              if (newCacheMs) {
                await fileCopy(
                  newCacheMs,
                  sourcepath,
                  path.dirname(outpath)
                );
              }
            } catch (e) {
              console.warn(
                'popCopy.onStart error',
                e
              );
            }
          }
        }
      });

      // @see https://esbuild.github.io/plugins/#end-callbacks
      build.onEnd(result => {
        popCopy.onStarted = false;
      });
    },
  };
}

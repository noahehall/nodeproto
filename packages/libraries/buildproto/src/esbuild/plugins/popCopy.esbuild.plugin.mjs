// @flow

// TODO: doesnt recursively search all child directories, only the first

import { fsproto } from '@nodeproto/wtf';
import path from 'path';

import type { ObjectType } from '../../libdefs';

const fs = { fsproto };

export const esbuildPluginPopCopyConfig = ({
  endingWith,
  indir,
  outdir,
  recurse = true,
}: {
  endingWith: RegExp,
  indir: string,
  outdir: string,
  recurse: boolean,
}): { options: ObjectType[]} => ({
  options: [
    {
      endingWith,
      indir,
      outdir,
      recurse,
    },
  ],
});

// cache mapping { filepath: { input, output} }
// for us to return the previous output if the input hasnt change
// ALWAYS use the filepath as key
// @see https://esbuild.github.io/plugins/#caching-your-plugin
export const cache: Map<string, ObjectType> = new Map();

// fileShouldCopy(path) => lastModified in MS or undefined
export const fileShouldCopy = async (sourcepath: string): Promise<boolean> => {
  let fd;
  try {
    fd = await fs.open(sourcepath, 'r');
    if (!fd) return false;

    const { mtimeMs } = await fd.stat();
    const cacheMs = cache.get(sourcepath)?.ms;

    fd.close();

    return (!cacheMs || cacheMs < mtimeMs) && mtimeMs;
  } catch (e) {
    console.warn('error accessing file, removing from cache\n', {
      sourcepath,
      e,
    });

    fd?.close();
    cache.delete(sourcepath);

    return false;
  }
};

// copy file into specified outdir && caches file time in ms
export const fileCopy = async (newCacheMs: number, sourcepath: string, outdir: string): Promise<boolean> => {
  try {
    if (newCacheMs) {
      const outpath = `${outdir}/${path.basename(sourcepath)}`;

      cache.set(sourcepath, { ms: newCacheMs, outpath });

      await fs.mkdir(outdir, { recursive: true });

      // dont catch let it throw
      await fs.copyFile(sourcepath, outpath);

      return true;
    }
  } catch (e) {
    console.warn('\n\n error copying file into outdir', { sourcepath, e });

    cache.delete(sourcepath);
  }
  return false;
};

// searches for files to copy
// sets filepaths as keys in cache
export const filesToCopy = async (options: ObjectType[]): Promise<void> => {
  const msg = 'not copying files:';

  if (!options.length) return console.warn(`${msg} options empty`, options);

  // TODO: cant use async with forEach.. duh
  options.forEach(async ({ outdir, endingWith, indir, recurse, ...opts }) => {
    try {
      if (
        !(endingWith instanceof RegExp)
          || !indir?.startsWith('/')
          || !outdir?.startsWith('/')
      ) {
        return console.warn(`${msg} invalid params`, {
          endingWith,
          indir,
          opts,
          outdir,
          recurse,
        });
      }

      const sourcedirs = (await fs.readdir(indir, { encoding: 'utf8', withFileTypes: true })) ?? [];

      sourcedirs.forEach((dirEnt) => {
        // check all child-dirs
        // need to check dirEnt[symbol] type === 2
        // because duh files without extensions
        if (!dirEnt.name.includes('.') && recurse) {
          filesToCopy([
            {
              ...opts,
              endingWith,
              indir: `${indir}/${dirEnt.name}`,
              outdir,
              recurse,
            },
          ]);
        } else {
          // check if filename endsWith regex
          if (endingWith.test(dirEnt.name)) {
            // check if files should be copied
            const sourcepath = `${indir}/${dirEnt.name}`;
            const outpath = `${outdir}/${dirEnt.name}`;

            cache.set(sourcepath, { ms: null, outpath });
          }
        }
      });
    } catch (e) {
      console.error('\n\n error in popcopy', e);
    }
  });
};

const name = 'popCopyPlugin';

export const esbuildPluginPopCopy = (config: ObjectType): ObjectType => {
  esbuildPluginPopCopy.options = config;
  esbuildPluginPopCopy.onStarted = false;

  return {
    name,
    setup(build) {
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
      const { options } = esbuildPluginPopCopy.options ?? {};

      // TODO: we should not need this check ?
      if (!options) return;

      // STEP 1
      // retrieve asset directories from options
      // scan each dir for files matching provided regex
      // for each file found run cache.set(filePath, undefined)
      filesToCopy(options);

      build.onResolve({ filter: /^popcopy$/ }, () => ({}));

      // TODO: move into distinct fn
      // @see https://esbuild.github.io/plugins/#start-callbacks
      build.onStart(async () => {
        if (esbuildPluginPopCopy.onStarted) return;

        esbuildPluginPopCopy.onStarted = true;

        // STEP 2
        // loop cache and copy files if necessary
        if (cache.size) {
          for (const [sourcepath, { ms, outpath }] of cache) {
            try {
              const newCacheMs = await fileShouldCopy(sourcepath);

              if (newCacheMs) await fileCopy(newCacheMs, sourcepath, path.dirname(outpath));
            } catch (e) {
              console.warn('esbuildPluginPopCopy.onStart error', e);
            }
          }
        }
      });

      // @see https://esbuild.github.io/plugins/#end-callbacks
      build.onEnd((result) => (esbuildPluginPopCopy.onStarted = false));
    },
  };
};

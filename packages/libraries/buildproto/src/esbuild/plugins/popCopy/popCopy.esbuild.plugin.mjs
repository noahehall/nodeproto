// @flow

// copy things + filtering

import { dirname, join, relative, resolve } from 'path';
import { dirs, getFsproto } from '@nodeproto/wtf';
import { isRegExp, throwIt } from '@nodeproto/shared';

import type {
  EsbuildSetupInterface,
  PopCopyOptionsType,
} from '../../../libdefs';

const defaultImportKinds = /(import-statement|require-call|dynamic-import|require-resolve)/;

const { fs } = getFsproto(true);
const { fs: memfs } = getFsproto(false);

// fkn memfs.stat requires callback
// thus we have to use fs for fs.stat, and either fs/memfs for copyFile
// @see https://github.com/streamich/memfs/blob/master/docs/api-status.md
const copyFile = async (
  sourcePath: string,
  outPath: string,
  write: boolean = false): Promise<void> => write
  // $FlowFixMe - need to fix type
  ? fs.copyFile(sourcePath, outPath)
  // $FlowFixMe - need to fix type
  : memfs.copyFile(sourcePath, outPath);

// copies files to outdir
// this makes each file a runtime dependency instead of a buildtime dependency
// will fail on directories, see the new expiremental fs.cp for directoires
// ^ https://nodejs.org/api/fs.html#fspromisescpsrc-dest-options
export class EsbuildPluginPopCopy {
  name: string;
  #popCopyConfig: PopCopyOptionsType;

  constructor({
    acceptedImportKinds = defaultImportKinds,
    cache = new Map(),
    filter, // @see https://pkg.go.dev/regexp
  }: PopCopyOptionsType): void {
    if (!isRegExp(filter)) return throwIt('`popCopyPlugin`: matching param must be regex conforming to Go`s regex syntax');

    // esbuild errs if we assign any unexpected members to the plugin instance
    // ^ so we use a private field
    this.#popCopyConfig = Object.freeze({
      cache,
      filter,
      validImportKinds: acceptedImportKinds,
    });

    this.name = 'esbuild-plugin-popCopy';
  }

  setup: EsbuildSetupInterface = (build) => {
    build.onResolve(
      { filter: this.#popCopyConfig.filter },
      async ({ kind, path, resolveDir }) => {
        const { cache, validImportKinds } = this.#popCopyConfig;

        if (!cache || !validImportKinds || !validImportKinds.test(kind)) return void 0;

        const { outdir } = build.initialOptions;
        if (!outdir) return void 0;

        const sourcePath = join(resolveDir, path);

        if (!cache.has(sourcePath)) {
          const outPath = join(outdir, path);
          const { mtimeMs: ms } = await fs.stat(sourcePath);
          await copyFile(sourcePath, outPath, build.initialOptions.write);

          cache.set(sourcePath, { outPath, sourcePath, ms });
        }
        else {
          const { ms, outPath } = cache.get(sourcePath) || {};

          if (!ms || outPath) return void 0;

          const { mtimeMs: sourceMs } = await fs.stat(sourcePath);

          if (sourceMs > ms) {
            await copyFile(sourcePath, outPath, build.initialOptions.write);
            cache.set(sourcePath, { outPath, sourcePath, ms: sourceMs });
          }
        }

        // might not need to return watchFiles[sourcePath]
        return { external: true, namespace: this.name };
      }
    );
  };
};

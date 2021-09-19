import envproto from '@nodeproto/envproto';
import fsproto from '@nodeproto/wtf/fsproto';
import popCopy from './plugins/popCopy.esbuild.plugin.mjs';

import esbuild from 'esbuild';

const buildResult = await esbuild.build(esbuildConfig);
isBuild && buildLogAndDevOrStop(buildResult); // isDev handled by watch.onRebuild

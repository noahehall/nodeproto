// @flow

import webpack from 'webpack';

import { baseWebpackConfig } from './base.webpack.config';
import { generateBasePlugins } from './utility.webpack.config';

import type {
  NodeprotoPackType,
  ObjectType,
  ReactDevType,
  WebpackConfigType,
  WebpackPluginType,
} from '../../libdefs';

export const reactWebpackConfig = async ({
  entry,
  htmlOptions = {},
  entryUnshift = [],
  entryPush = [],
  pluginsPush = [],
  pluginsUnshift = [],

  ...rest
}: ReactDevType): Promise<{config: WebpackConfigType, pack: NodeprotoPackType}> => baseWebpackConfig(
  Object.assign(
    {},
    {
      entry,
      entryPush,
      entryUnshift: ['react-devtools', 'webpack-hot-middleware-2/client']
        .concat(entryUnshift),
      pluginsPush: generateBasePlugins(htmlOptions, pluginsPush),
      pluginsUnshift,
    },
    rest
  )
);

// @flow

import webpack from 'webpack';

import { baseWebpackConfig } from './base.webpack.config';
import { generateBasePlugins } from './utility.webpack.config';

import type {
  BaseWebpackType,
  ObjectType,
  WebpackConfigType,
  WebpackPluginType,
} from '../../libdefs';

export const reactDevWebpackConfig = async ({
  entry,
  htmlOptions = {},
  entryUnshift = [],
  entryPush = [],
  pluginsPush = [],
  pluginsUnshift = [],

  ...rest
}: BaseWebpackType): Promise<WebpackConfigType> => baseWebpackConfig(
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

import HtmlWebpackPlugin from 'html-webpack-plugin';
import {
  buildWebpackConfig,
  reactEsbuildWebpackConfig,
  setupWebpackConfig,
} from '@nodeproto/configproto';

const {
  // context,
  // pkgJson,
  pathDist,

  ...conf
} = await setupWebpackConfig();

const webpackConfig = reactEsbuildWebpackConfig({
  entry: conf.resolve('./copypasta/react/helloworld/index.jsx'),
  htmlOptions: { template: conf.resolve('./copypasta/react/helloworld/index.html') },
  HtmlWebpackPlugin,
  outputDir: conf.resolve('./cjs/copypasta/react/', pathDist),
});

buildWebpackConfig(webpackConfig);

import devConfig from '../lib/webpack.dev.config.mjs';
import Koa from 'koa';
import middleware from 'webpack-dev-middleware-2';
import webpack from 'webpack';
import webpackHotMiddleware from 'webpack-hot-middleware-2';

const compiler = webpack(devConfig);
const app = new Koa();

import dep1 from 'dep1';

console.log('\n\n\n\n dep1', dep1)
throw 'hello';


app.use(middleware(
  compiler,
  {
    publicPath: devConfig.publicPath,
    writeToDisk: false,
    useBff: 'useKoa2',
    stats: 'errors-warnings',
  }
));

app.use(webpackHotMiddleware(
  compiler,
  { useBff: 'useKoa2' }
))

app.listen(
  process.env.CLIENT_PORT,
  () => {
    console.log(
      '@nodeproto/client running on: ',
      process.env.CLIENT_PORT
    )
  }
);

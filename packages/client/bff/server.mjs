'use strict';


import koaWebpack from 'koa-webpack';
import Koa from 'koa';
import webpackDevConfig from '../lib/webpack.dev.config.mjs';
import webpack from 'webpack';
import http from 'http';


console.log('\n\n webpack config', webpackDevConfig);
const compiler = webpack(webpackDevConfig);
const middleware = await koaWebpack({ compiler });
const app = new Koa();


app.use(middleware);


app.use(async ctx => {
  const filename = path.resolve(webpackConfig.output.path, 'index.html');
  ctx.response.type = 'html';
  ctx.response.body = middleware.devMiddleware.fileSystem.createReadStream(filename);

})


app.listen(process.env.CLIENT_PORT, () => {
  console.log('@nodeproto/client running on: ', process.env.CLIENT_PORT)
});

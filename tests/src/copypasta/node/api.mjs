// mimics or a more realistic example to help with bug hunting

import Koa from 'koa';
import * as fixtures from './nodeFixtures.cjs';
import { dirs, isMain } from '@nodeproto/wtf';

const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello World';
});

const runApp = async () => {
  // console.info(Object.keys(fixtures));
  // console.info(Object.keys(dirs));
  console.info(Object.keys(dirs.shelljs.cat));
  console.info(dirs.shelljs.cat);
};

const iscjs = typeof require !== 'undefined';
if(isMain(iscjs && require.main, import.meta)) {
  // top level await not available in node14
  // await runApp();

  runApp();
}

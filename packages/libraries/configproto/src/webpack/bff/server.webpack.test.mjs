import { fileURLToPath } from 'url';
import { getOpts as reactDevOpts } from '../react.dev.webpack.config.test.mjs';
import { getOpts as reactEsbuildOpts } from '../react.esbuild.webpack.config.test.mjs';

import path from 'path';
import reactDevWebpackConfig from '../react.dev.webpack.config.mjs';
import reactEsbuildWebpackConfig from '../react.esbuild.webpack.config.mjs';
import t from '#t';
import webpackServer from './server.webpack.mjs';

const { assert, get } = t;

const thisDir = path.dirname(fileURLToPath(import.meta.url));

const getOpts = () => ({
  useConfig: {},
  pack: {},
});


const test = t.suite('server.webpack.mjs');

async function assertWebpackServerStateAndResponse(server, name) {
  return new Promise(resolve => {
    server.webpackDevMiddlewareInstance.waitUntilValid(() => {
      get(`http:${server.config.host}:${server.config.port}`, res => {
          // compiles
          assert.lengthOf(server.webpackDevMiddlewareInstance.context.stats.compilation.errors, 0, `${name} server compiles without errors`);
          // response
          assert.deepEqual(res.statusCode, 200, `${name} server returns 200 statusCode`);

          assert.include(res.headers['content-type'], 'text/html; charset=utf-8');

          resolve(true);
        });
    });
  });
}

test('throws', () => {
  let opts = getOpts();
  delete opts.useConfig;

  assert.throws(
    () => webpackServer(opts),
    /useConfig: Object: is required/,
    'if missing useConfig'
  );
});

test('server init & shutdown: react.dev.webpack.config', () => {
  const esm = webpackServer({
    useConfig: reactDevWebpackConfig(reactDevOpts({
      entry: [path.resolve(thisDir, '../fixtures/esm.mjs')],
    })),
    pack: { CLIENT_PORT: 8095, APP_NAME: 'esm server' },
  });

  esm.server.on('listening', async () => {
    assert.isTrue(esm.server.listening, true, 'esm server is running');

    await assertWebpackServerStateAndResponse(esm, 'react:dev:esm');

    esm.controller.abort();
    await esm.webpackDevMiddlewareInstance.close();

    assert.isFalse(esm.server.listening, false, 'esm server isnt running');
  });

  const cjs = webpackServer({
    useConfig: reactDevWebpackConfig(reactDevOpts({
      entry: [path.resolve(thisDir, '../fixtures/commonjs.cjs')],
    })),
    pack: { CLIENT_PORT: 8094, APP_NAME: 'cjs server' },
  });

  cjs.server.on('listening', async () => {
    assert.isTrue(cjs.server.listening, true, 'cjs server is running');

    await assertWebpackServerStateAndResponse(cjs, 'react:dev:cjs');

    cjs.controller.abort();
    await cjs.webpackDevMiddlewareInstance.close();

    assert.isFalse(cjs.server.listening, false, 'cjs server isnt running');
  });

  // yea i've never used jsx extension
  // but just need to add the babel preset to handle this in the event someone wants this
  // const jsx = webpackServer({
  //   useConfig: reactDevWebpackConfig(reactDevOpts({
  //     entry: [path.resolve(thisDir, '../fixtures/react.jsx')],
  //   })),
  //   pack: { CLIENT_PORT: 8083, APP_NAME: 'jsx server' },
  // });

  // jsx.server.on('listening', async () => {
  //   assert.is(jsx.server.listening, true, 'jsx server is running');

  //   await assertWebpackServerStateAndResponse(jsx, 'jsx');

  //   jsx.controller.abort();
  //   await jsx.webpackDevMiddlewareInstance.close();

  //   assert.is(jsx.server.listening, false, 'jsx server isnt running');
  // });

  const auto = webpackServer({
    useConfig: reactDevWebpackConfig(reactDevOpts({
      entry: [path.resolve(thisDir, '../fixtures/auto.js')],
    })),
    pack: { CLIENT_PORT: 8092, APP_NAME: 'auto server' },
  });

  auto.server.on('listening', async () => {
    assert.isTrue(auto.server.listening, true, 'auto server is running');

    await assertWebpackServerStateAndResponse(auto, 'react:dev:auto');

    auto.controller.abort();
    await auto.webpackDevMiddlewareInstance.close();

    assert.isFalse(auto.server.listening, false, 'auto server isnt running');
  });

  const flow = webpackServer({
    useConfig: reactDevWebpackConfig(reactDevOpts({
      entry: [path.resolve(thisDir, '../fixtures/flow.mjs')],
    })),
    pack: { CLIENT_PORT: 8091, APP_NAME: 'flow server' },
  });

  flow.server.on('listening', async () => {
    assert.isTrue(flow.server.listening, true, 'flow server is running');

    await assertWebpackServerStateAndResponse(flow, 'react:dev:flow');

    flow.controller.abort();
    await flow.webpackDevMiddlewareInstance.close();

    assert.isFalse(flow.server.listening, false, 'flow server isnt running');
  });
});

test('server init & shutdown: react.esbuild.webpack.config', () => {
  const esm = webpackServer({
    useConfig: reactEsbuildWebpackConfig(reactEsbuildOpts({
      entry: [path.resolve(thisDir, '../fixtures/esm.mjs')],
    })),
    pack: { CLIENT_PORT: 8085, APP_NAME: 'esm server' },
  });

  esm.server.on('listening', async () => {
    assert.isTrue(esm.server.listening, true, 'esm server is running');

    await assertWebpackServerStateAndResponse(esm, 'react:esbuild:esm');

    esm.controller.abort();
    await esm.webpackDevMiddlewareInstance.close();

    assert.isFalse(esm.server.listening, false, 'esm server isnt running');
  });

  const cjs = webpackServer({
    useConfig: reactEsbuildWebpackConfig(reactEsbuildOpts({
      entry: [path.resolve(thisDir, '../fixtures/commonjs.cjs')],
    })),
    pack: { CLIENT_PORT: 8084, APP_NAME: 'cjs server' },
  });

  cjs.server.on('listening', async () => {
    assert.isTrue(cjs.server.listening, true, 'cjs server is running');

    await assertWebpackServerStateAndResponse(cjs, 'react:esbuild:cjs');

    cjs.controller.abort();
    await cjs.webpackDevMiddlewareInstance.close();

    assert.isFalse(cjs.server.listening, false, 'cjs server isnt running');
  });

  const jsx = webpackServer({
    useConfig: reactEsbuildWebpackConfig(reactEsbuildOpts({
      entry: [path.resolve(thisDir, '../fixtures/react.jsx')],
    })),
    pack: { CLIENT_PORT: 8083, APP_NAME: 'jsx server' },
  });

  jsx.server.on('listening', async () => {
    assert.isTrue(jsx.server.listening, true, 'jsx server is running');

    await assertWebpackServerStateAndResponse(jsx, 'react:esbuild:jsx');

    jsx.controller.abort();
    await jsx.webpackDevMiddlewareInstance.close();

    assert.isFalse(jsx.server.listening, false, 'jsx server isnt running');
  });

  const auto = webpackServer({
    useConfig: reactEsbuildWebpackConfig(reactEsbuildOpts({
      entry: [path.resolve(thisDir, '../fixtures/auto.js')],
    })),
    pack: { CLIENT_PORT: 8082, APP_NAME: 'auto server' },
  });

  auto.server.on('listening', async () => {
    assert.isTrue(auto.server.listening, true, 'auto server is running');

    await assertWebpackServerStateAndResponse(auto, 'react:esbuild:auto');

    auto.controller.abort();
    await auto.webpackDevMiddlewareInstance.close();

    assert.isFalse(auto.server.listening, false, 'auto server isnt running');
  });

  const flow = webpackServer({
    useConfig: reactEsbuildWebpackConfig(reactEsbuildOpts({
      entry: [path.resolve(thisDir, '../fixtures/flow.mjs')],
    })),
    pack: { CLIENT_PORT: 8081, APP_NAME: 'flow server' },
  });

  flow.server.on('listening', async () => {
    assert.isTrue(flow.server.listening, true, 'flow server is running');

    await assertWebpackServerStateAndResponse(flow, 'react:esbuild:flow');

    flow.controller.abort();
    await flow.webpackDevMiddlewareInstance.close();

    assert.isFalse(flow.server.listening, false, 'flow server isnt running');
  });
});

test.run();

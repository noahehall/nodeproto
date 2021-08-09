import { fileURLToPath } from 'url';
import { getOpts as reactDevOpts } from '../react.dev.webpack.config.test.mjs';
import { getOpts as reactEsbuildOpts } from '../react.esbuild.webpack.config.test.mjs';
import { promisify } from 'util';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import http from 'http';
import path from 'path';
import reactDevWebpackConfig from '../react.dev.webpack.config.mjs';
import reactEsbuildWebpackConfig from '../react.esbuild.webpack.config.mjs';
import webpackServer from './server.webpack.mjs';

const thisDir = path.dirname(fileURLToPath(import.meta.url));

const get = promisify(http.get);

const getOpts = () => ({
  useConfig: {},
  pack: {},
});


const test = suite('server.webpack.mjs');

async function assertWebpackServerStateAndResponse(server, name) {
  return new Promise(resolve => {
    server.webpackDevMiddlewareInstance.waitUntilValid(() => {
      http.get(`http:${server.config.host}:${server.config.port}`, res => {
          // if (res.statusCode !== 200) throw new Error(`Expected 200 response, got ${res.statusCode}`);

          // compiles
          assert.is(server.webpackDevMiddlewareInstance.context.stats.compilation.errors.length, 0, `${name} server compiles without errors`);
          // response
          assert.is(res.statusCode, 200, `${name} server returns 200 statusCode`);
          assert.is(res.headers['content-type'].includes('text/html'), true, `${name} server returns text/html`);

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
    assert.is(esm.server.listening, true, 'esm server is running');

    await assertWebpackServerStateAndResponse(esm, 'react:dev:esm');

    esm.controller.abort();
    await esm.webpackDevMiddlewareInstance.close();

    assert.is(esm.server.listening, false, 'esm server isnt running');
  });

  const cjs = webpackServer({
    useConfig: reactDevWebpackConfig(reactDevOpts({
      entry: [path.resolve(thisDir, '../fixtures/commonjs.cjs')],
    })),
    pack: { CLIENT_PORT: 8094, APP_NAME: 'cjs server' },
  });

  cjs.server.on('listening', async () => {
    assert.is(cjs.server.listening, true, 'cjs server is running');

    await assertWebpackServerStateAndResponse(cjs, 'react:dev:cjs');

    cjs.controller.abort();
    await cjs.webpackDevMiddlewareInstance.close();

    assert.is(cjs.server.listening, false, 'cjs server isnt running');
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
    assert.is(auto.server.listening, true, 'auto server is running');

    await assertWebpackServerStateAndResponse(auto, 'react:dev:auto');

    auto.controller.abort();
    await auto.webpackDevMiddlewareInstance.close();

    assert.is(auto.server.listening, false, 'auto server isnt running');
  });

  const flow = webpackServer({
    useConfig: reactDevWebpackConfig(reactDevOpts({
      entry: [path.resolve(thisDir, '../fixtures/flow.mjs')],
    })),
    pack: { CLIENT_PORT: 8091, APP_NAME: 'flow server' },
  });

  flow.server.on('listening', async () => {
    assert.is(flow.server.listening, true, 'flow server is running');

    await assertWebpackServerStateAndResponse(flow, 'react:dev:flow');

    flow.controller.abort();
    await flow.webpackDevMiddlewareInstance.close();

    assert.is(flow.server.listening, false, 'flow server isnt running');
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
    assert.is(esm.server.listening, true, 'esm server is running');

    await assertWebpackServerStateAndResponse(esm, 'react:esbuild:esm');

    esm.controller.abort();
    await esm.webpackDevMiddlewareInstance.close();

    assert.is(esm.server.listening, false, 'esm server isnt running');
  });

  const cjs = webpackServer({
    useConfig: reactEsbuildWebpackConfig(reactEsbuildOpts({
      entry: [path.resolve(thisDir, '../fixtures/commonjs.cjs')],
    })),
    pack: { CLIENT_PORT: 8084, APP_NAME: 'cjs server' },
  });

  cjs.server.on('listening', async () => {
    assert.is(cjs.server.listening, true, 'cjs server is running');

    await assertWebpackServerStateAndResponse(cjs, 'react:esbuild:cjs');

    cjs.controller.abort();
    await cjs.webpackDevMiddlewareInstance.close();

    assert.is(cjs.server.listening, false, 'cjs server isnt running');
  });

  const jsx = webpackServer({
    useConfig: reactEsbuildWebpackConfig(reactEsbuildOpts({
      entry: [path.resolve(thisDir, '../fixtures/react.jsx')],
    })),
    pack: { CLIENT_PORT: 8083, APP_NAME: 'jsx server' },
  });

  jsx.server.on('listening', async () => {
    assert.is(jsx.server.listening, true, 'jsx server is running');

    await assertWebpackServerStateAndResponse(jsx, 'react:esbuild:jsx');

    jsx.controller.abort();
    await jsx.webpackDevMiddlewareInstance.close();

    assert.is(jsx.server.listening, false, 'jsx server isnt running');
  });

  const auto = webpackServer({
    useConfig: reactEsbuildWebpackConfig(reactEsbuildOpts({
      entry: [path.resolve(thisDir, '../fixtures/auto.js')],
    })),
    pack: { CLIENT_PORT: 8082, APP_NAME: 'auto server' },
  });

  auto.server.on('listening', async () => {
    assert.is(auto.server.listening, true, 'auto server is running');

    await assertWebpackServerStateAndResponse(auto, 'react:esbuild:auto');

    auto.controller.abort();
    await auto.webpackDevMiddlewareInstance.close();

    assert.is(auto.server.listening, false, 'auto server isnt running');
  });

  const flow = webpackServer({
    useConfig: reactEsbuildWebpackConfig(reactEsbuildOpts({
      entry: [path.resolve(thisDir, '../fixtures/flow.mjs')],
    })),
    pack: { CLIENT_PORT: 8081, APP_NAME: 'flow server' },
  });

  flow.server.on('listening', async () => {
    assert.is(flow.server.listening, true, 'flow server is running');

    await assertWebpackServerStateAndResponse(flow, 'react:esbuild:flow');

    flow.controller.abort();
    await flow.webpackDevMiddlewareInstance.close();

    assert.is(flow.server.listening, false, 'flow server isnt running');
  });
});

// help determining what error is
test.skip('throws', () => {
  // this should throw and reveal error in console
  assert.ok(
    webpackServer({ pkgJsonPath: './doesnt.exist.here.json' })
  );
});

test.run();

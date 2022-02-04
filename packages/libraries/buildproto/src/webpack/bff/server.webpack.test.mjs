import * as t from '@nodeproto/testproto/t';
import http from 'http';

import { reactDevWebpackConfig, webpackServer } from '@nodeproto/buildproto';

const { assert } = t;

const test = t.suite('server.webpack');

async function assertWebpackServerStateAndResponse(server, name) {
  return new Promise((resolve) => {
    server.webpackDevMiddlewareInstance.waitUntilValid(() => {
      http.get(`http:${server.cidr.host}:${server.cidr.port}`, (res) => {
        // compiles
        assert.lengthOf(
          server.webpackDevMiddlewareInstance.context.stats.compilation.errors,
          0,
          `${name} server compiles without errors`
        );

        // response
        assert.equal(res.statusCode, 200, `${name} server returns 200 statusCode`);

        assert.include(res.headers['content-type'], 'text/html; charset=utf-8');
        resolve(true);
      });
    });
  });
}

test.before.each((context) => {
  const reactDevOpts = {
    entry: ['./src/fixtures/esm.mjs'],
  };

  context.fixtures = {
    reactDevOpts,
  };
});

test.after.each((context) => {
  delete context.fixtures;
});

test('webpackServer: throws', () => {
  assert.throws(() => webpackServer());
  assert.throws(() => webpackServer({ pack: {}, webpackConfig: 'poop' }));
  assert.throws(() => webpackServer({ pack: 'poop', webpackConfig: {} }));
  assert.throws(() =>
    webpackServer({
      pack: {},
      webpackConfig: { output: { publicPath: () => 'public path has to be a string' } },
    })
  );
});

test('webpackServer: development server', async (context) => {
  const { reactDevOpts } = context.fixtures;
  const { config, pack } = await reactDevWebpackConfig(reactDevOpts);

  const esm = webpackServer({ config, pack });

  esm.server.on('listening', async () => {
    assert.isTrue(esm.server.listening, 'server is running');
    await assertWebpackServerStateAndResponse(esm, 'react:dev:esm');

    esm.controller.abort();
    await esm.webpackDevMiddlewareInstance.close();
    assert.isFalse(esm.server.listening, 'server isnt running');
  });
});

test.run();

// TODO: once I rework esbuild
// test('server init & shutdown: react.esbuild.webpack.config', () => {
//   const esm = webpackServer({
//     useConfig: reactEsbuildWebpackConfig(
//       reactEsbuildOpts({
//         context: thisDir,
//         entry: getEntry('esm.mjs'),
//       })
//     ),
//     pack: { CLIENT_PORT: 8085, APP_NAME: 'esm server' },
//   });

//   esm.server.on('listening', async () => {
//     assert.isTrue(esm.server.listening, 'esm server is running');

//     await assertWebpackServerStateAndResponse(esm, 'react:esbuild:esm');

//     esm.controller.abort();
//     await esm.webpackDevMiddlewareInstance.close();

//     assert.isFalse(esm.server.listening, 'esm server isnt running');
//   });

//   const cjs = webpackServer({
//     useConfig: reactEsbuildWebpackConfig(
//       reactEsbuildOpts({
//         context: thisDir,
//         entry: getEntry('commonjs.cjs'),
//       })
//     ),
//     pack: { CLIENT_PORT: 8084, APP_NAME: 'cjs server' },
//   });

//   cjs.server.on('listening', async () => {
//     assert.isTrue(cjs.server.listening, 'cjs server is running');

//     await assertWebpackServerStateAndResponse(cjs, 'react:esbuild:cjs');

//     cjs.controller.abort();
//     await cjs.webpackDevMiddlewareInstance.close();

//     assert.isFalse(cjs.server.listening, 'cjs server isnt running');
//   });

//   // const jsx = webpackServer({
//   //   useConfig: reactEsbuildWebpackConfig(reactEsbuildOpts({
//   //     context: thisDir,
//   //     entry: getEntry('react.jsx')
//   //   })),
//   //   pack: { CLIENT_PORT: 8083, APP_NAME: 'jsx server' },
//   // });

//   // jsx.server.on('listening', async () => {
//   //   assert.isTrue(jsx.server.listening, 'jsx server is running');

//   //   await assertWebpackServerStateAndResponse(jsx, 'react:esbuild:jsx');

//   //   jsx.controller.abort();
//   //   await jsx.webpackDevMiddlewareInstance.close();

//   //   assert.isFalse(jsx.server.listening, 'jsx server isnt running');
//   // });

//   const auto = webpackServer({
//     useConfig: reactEsbuildWebpackConfig(
//       reactEsbuildOpts({
//         context: thisDir,
//         entry: getEntry('auto.js'),
//       })
//     ),
//     pack: { CLIENT_PORT: 8082, APP_NAME: 'auto server' },
//   });

//   auto.server.on('listening', async () => {
//     assert.isTrue(auto.server.listening, 'auto server is running');

//     await assertWebpackServerStateAndResponse(auto, 'react:esbuild:auto');

//     auto.controller.abort();
//     await auto.webpackDevMiddlewareInstance.close();

//     assert.isFalse(auto.server.listening, 'auto server isnt running');
//   });

//   const flow = webpackServer({
//     useConfig: reactEsbuildWebpackConfig(
//       reactEsbuildOpts({
//         context: thisDir,
//         entry: getEntry('flow.mjs'),
//       })
//     ),
//     pack: { CLIENT_PORT: 8081, APP_NAME: 'flow server' },
//   });

//   flow.server.on('listening', async () => {
//     assert.isTrue(flow.server.listening, 'flow server is running');

//     await assertWebpackServerStateAndResponse(flow, 'react:esbuild:flow');

//     flow.controller.abort();
//     await flow.webpackDevMiddlewareInstance.close();

//     assert.isFalse(flow.server.listening, 'flow server isnt running');
//   });
// });

// test.run();

// $FlowTODO

import * as t from "@nodeproto/testproto";
import { dirs } from "@nodeproto/wtf";
import { getOpts as reactDevOpts } from "../react.dev.webpack.config.test";
import { getOpts as reactEsbuildOpts } from "../react.esbuild.webpack.config.test";

import path from "path";
import reactDevWebpackConfig from "../react.dev.webpack.config";
import reactEsbuildWebpackConfig from "../react.esbuild.webpack.config";
import webpackServer from "./server.webpack";

const { assert, get } = t;

const thisDir = dirs.dirname(import.meta.url);
const fixtures = "../../../fixtures/";
const getEntry = (file) => [path.resolve(thisDir, fixtures, file)];

const getOpts = () => ({
  useConfig: {},
  pack: {},
});

const test = t.suite("server.webpack");

async function assertWebpackServerStateAndResponse(server, name) {
  return new Promise((resolve) => {
    server.webpackDevMiddlewareInstance.waitUntilValid(() => {
      get(`http:${server.config.host}:${server.config.port}`, (res) => {
        // compiles
        assert.lengthOf(
          server.webpackDevMiddlewareInstance.context.stats.compilation.errors,
          0,
          `${name} server compiles without errors`
        );
        // response
        assert.deepEqual(
          res.statusCode,
          200,
          `${name} server returns 200 statusCode`
        );

        assert.include(res.headers["content-type"], "text/html; charset=utf-8");

        resolve(true);
      });
    });
  });
}

test("throws", () => {
  let opts = getOpts();
  delete opts.useConfig;

  assert.throws(
    () => webpackServer(opts),
    /useConfig: Object: is required/,
    "if missing useConfig"
  );
});

test("server init & shutdown: react.dev.webpack.config", () => {
  const esm = webpackServer({
    useConfig: reactDevWebpackConfig(
      reactDevOpts({
        // context: thisDir,
        entry: getEntry("esm.mjs"),
      })
    ),
    pack: { CLIENT_PORT: 8095, APP_NAME: "esm server" },
  });

  esm.server.on("listening", async () => {
    assert.isTrue(esm.server.listening, "esm server is running");

    await assertWebpackServerStateAndResponse(esm, "react:dev:esm");

    esm.controller.abort();
    await esm.webpackDevMiddlewareInstance.close();

    assert.isFalse(esm.server.listening, "esm server isnt running");
  });

  const cjs = webpackServer({
    useConfig: reactDevWebpackConfig(
      reactDevOpts({
        context: thisDir,
        entry: getEntry("commonjs.cjs"),
      })
    ),
    pack: { CLIENT_PORT: 8094, APP_NAME: "cjs server" },
  });

  cjs.server.on("listening", async () => {
    assert.isTrue(cjs.server.listening, "cjs server is running");

    await assertWebpackServerStateAndResponse(cjs, "react:dev:cjs");

    cjs.controller.abort();
    await cjs.webpackDevMiddlewareInstance.close();

    assert.isFalse(cjs.server.listening, "cjs server isnt running");
  });

  const auto = webpackServer({
    useConfig: reactDevWebpackConfig(
      reactDevOpts({
        context: thisDir,
        entry: getEntry("auto.js"),
      })
    ),
    pack: { CLIENT_PORT: 8092, APP_NAME: "auto server" },
  });

  auto.server.on("listening", async () => {
    assert.isTrue(auto.server.listening, "auto server is running");

    await assertWebpackServerStateAndResponse(auto, "react:dev:auto");

    auto.controller.abort();
    await auto.webpackDevMiddlewareInstance.close();

    assert.isFalse(auto.server.listening, "auto server isnt running");
  });

  const flow = webpackServer({
    useConfig: reactDevWebpackConfig(
      reactDevOpts({
        context: thisDir,
        entry: getEntry("flow.mjs"),
      })
    ),
    pack: { CLIENT_PORT: 8091, APP_NAME: "flow server" },
  });

  flow.server.on("listening", async () => {
    assert.isTrue(flow.server.listening, "flow server is running");

    await assertWebpackServerStateAndResponse(flow, "react:dev:flow");

    flow.controller.abort();
    await flow.webpackDevMiddlewareInstance.close();

    assert.isFalse(flow.server.listening, "flow server isnt running");
  });
});

test("server init & shutdown: react.esbuild.webpack.config", () => {
  const esm = webpackServer({
    useConfig: reactEsbuildWebpackConfig(
      reactEsbuildOpts({
        context: thisDir,
        entry: getEntry("esm.mjs"),
      })
    ),
    pack: { CLIENT_PORT: 8085, APP_NAME: "esm server" },
  });

  esm.server.on("listening", async () => {
    assert.isTrue(esm.server.listening, "esm server is running");

    await assertWebpackServerStateAndResponse(esm, "react:esbuild:esm");

    esm.controller.abort();
    await esm.webpackDevMiddlewareInstance.close();

    assert.isFalse(esm.server.listening, "esm server isnt running");
  });

  const cjs = webpackServer({
    useConfig: reactEsbuildWebpackConfig(
      reactEsbuildOpts({
        context: thisDir,
        entry: getEntry("commonjs.cjs"),
      })
    ),
    pack: { CLIENT_PORT: 8084, APP_NAME: "cjs server" },
  });

  cjs.server.on("listening", async () => {
    assert.isTrue(cjs.server.listening, "cjs server is running");

    await assertWebpackServerStateAndResponse(cjs, "react:esbuild:cjs");

    cjs.controller.abort();
    await cjs.webpackDevMiddlewareInstance.close();

    assert.isFalse(cjs.server.listening, "cjs server isnt running");
  });

  // const jsx = webpackServer({
  //   useConfig: reactEsbuildWebpackConfig(reactEsbuildOpts({
  //     context: thisDir,
  //     entry: getEntry('react.jsx')
  //   })),
  //   pack: { CLIENT_PORT: 8083, APP_NAME: 'jsx server' },
  // });

  // jsx.server.on('listening', async () => {
  //   assert.isTrue(jsx.server.listening, 'jsx server is running');

  //   await assertWebpackServerStateAndResponse(jsx, 'react:esbuild:jsx');

  //   jsx.controller.abort();
  //   await jsx.webpackDevMiddlewareInstance.close();

  //   assert.isFalse(jsx.server.listening, 'jsx server isnt running');
  // });

  const auto = webpackServer({
    useConfig: reactEsbuildWebpackConfig(
      reactEsbuildOpts({
        context: thisDir,
        entry: getEntry("auto.js"),
      })
    ),
    pack: { CLIENT_PORT: 8082, APP_NAME: "auto server" },
  });

  auto.server.on("listening", async () => {
    assert.isTrue(auto.server.listening, "auto server is running");

    await assertWebpackServerStateAndResponse(auto, "react:esbuild:auto");

    auto.controller.abort();
    await auto.webpackDevMiddlewareInstance.close();

    assert.isFalse(auto.server.listening, "auto server isnt running");
  });

  const flow = webpackServer({
    useConfig: reactEsbuildWebpackConfig(
      reactEsbuildOpts({
        context: thisDir,
        entry: getEntry("flow.mjs"),
      })
    ),
    pack: { CLIENT_PORT: 8081, APP_NAME: "flow server" },
  });

  flow.server.on("listening", async () => {
    assert.isTrue(flow.server.listening, "flow server is running");

    await assertWebpackServerStateAndResponse(flow, "react:esbuild:flow");

    flow.controller.abort();
    await flow.webpackDevMiddlewareInstance.close();

    assert.isFalse(flow.server.listening, "flow server isnt running");
  });
});

test.run();

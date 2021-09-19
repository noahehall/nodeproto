"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;

var _interopRequireWildcard2 = _interopRequireDefault(require("@babel/runtime/helpers/interopRequireWildcard"));

var _module = require("module");

var _utils = require("@nodeproto/utils");

var _esbuild = _interopRequireDefault(require("esbuild"));

var _fs = _interopRequireDefault(require("fs"));

var _esbuildPluginManifest = _interopRequireDefault(require("esbuild-plugin-manifest"));

var _path = _interopRequireDefault(require("path"));

var _package = _interopRequireDefault(require("../package.json"));

const appInputFilename = 'index';
const appExtension = '.mjs';
const appId = appInputFilename + appExtension;
const manifestFilename = 'manifest.json';

const outdir = _path.default.resolve('dist');

const manifestUri = outdir + '/' + manifestFilename;
const conditions = process.execArgv.filter(x => x.startsWith('--conditions'));
const isBuild = !!conditions.filter(x => x.endsWith('build')).length;
const isDev = !isBuild;
let servers = undefined;

const stopDev = async () => isDev && servers?.length && servers.forEach(s => s.close());

const startDev = async () => {
  if (isBuild) return;
  await stopDev();
  return _fs.default.promises.readFile(manifestUri, 'utf-8').then(manifest => Promise.resolve(`${'../' + JSON.parse(manifest)[appInputFilename]}`).then(s => (0, _interopRequireWildcard2.default)(require(s)))).then(async newServers => {
    if (newServers) servers = await newServers.runApp();
    return servers;
  });
};

const buildLogAndDevOrStop = ({
  errors,
  warnings,
  ...result
}) => {
  console.info('\n\n finished build\n', Object.keys(result.metafile.outputs));
  if (errors.length || warnings.length) console.warn('\n\n build notifications', {
    errors,
    warnings
  });
  if (isDev) startDev();else if (isBuild) result.stop();
};

const popCopyConfig = {
  options: [{
    endingWith: /openapi\.(yml|yaml)$/,
    indir: (await _utils.fsproto.resolve('../app', import.meta.url)).replace('file://', ''),
    outdir,
    recurse: true
  }]
};
const manifestPluginConfig = {
  extensionless: 'input',
  filename: manifestFilename,
  hash: false,
  shortNames: false
};
const esbuildConfig = {
  assetNames: 'assets/[name]-[hash]',
  bundle: true,
  define: _utils.envproto.syncEnv(_package.default).processEnv,
  entryNames: isDev ? '[name]-[hash]' : '[name]',
  entryPoints: [appId],
  external: _module.builtinModules,
  metafile: true,
  minify: false,
  outdir,
  outExtension: {
    '.js': '.cjs'
  },
  platform: 'node',
  plugins: [_utils.esproto.popCopy(popCopyConfig), (0, _esbuildPluginManifest.default)(manifestPluginConfig)],
  resolveExtensions: ['.mjs', '.js', '.cjs', '.json'],
  sourcemap: true,
  target: ['node14.17.0'],
  watch: {
    async onRebuild(error, result) {
      buildLogAndDevOrStop(result);
      if (error) console.error(error);
    }

  },
  write: true
};
const buildResult = await _esbuild.default.build(esbuildConfig);
isBuild && buildLogAndDevOrStop(buildResult);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzYnVpbGQvYmFja2VuZC5lc2J1aWxkLmNvbmZpZy5tanMiXSwibmFtZXMiOlsiYXBwSW5wdXRGaWxlbmFtZSIsImFwcEV4dGVuc2lvbiIsImFwcElkIiwibWFuaWZlc3RGaWxlbmFtZSIsIm91dGRpciIsInBhdGgiLCJyZXNvbHZlIiwibWFuaWZlc3RVcmkiLCJjb25kaXRpb25zIiwicHJvY2VzcyIsImV4ZWNBcmd2IiwiZmlsdGVyIiwieCIsInN0YXJ0c1dpdGgiLCJpc0J1aWxkIiwiZW5kc1dpdGgiLCJsZW5ndGgiLCJpc0RldiIsInNlcnZlcnMiLCJ1bmRlZmluZWQiLCJzdG9wRGV2IiwiZm9yRWFjaCIsInMiLCJjbG9zZSIsInN0YXJ0RGV2IiwiZnMiLCJwcm9taXNlcyIsInJlYWRGaWxlIiwidGhlbiIsIm1hbmlmZXN0IiwiSlNPTiIsInBhcnNlIiwibmV3U2VydmVycyIsInJ1bkFwcCIsImJ1aWxkTG9nQW5kRGV2T3JTdG9wIiwiZXJyb3JzIiwid2FybmluZ3MiLCJyZXN1bHQiLCJjb25zb2xlIiwiaW5mbyIsIk9iamVjdCIsImtleXMiLCJtZXRhZmlsZSIsIm91dHB1dHMiLCJ3YXJuIiwic3RvcCIsInBvcENvcHlDb25maWciLCJvcHRpb25zIiwiZW5kaW5nV2l0aCIsImluZGlyIiwiZnNwcm90byIsImltcG9ydCIsIm1ldGEiLCJ1cmwiLCJyZXBsYWNlIiwicmVjdXJzZSIsIm1hbmlmZXN0UGx1Z2luQ29uZmlnIiwiZXh0ZW5zaW9ubGVzcyIsImZpbGVuYW1lIiwiaGFzaCIsInNob3J0TmFtZXMiLCJlc2J1aWxkQ29uZmlnIiwiYXNzZXROYW1lcyIsImJ1bmRsZSIsImRlZmluZSIsImVudnByb3RvIiwic3luY0VudiIsInBrZ0pzb24iLCJwcm9jZXNzRW52IiwiZW50cnlOYW1lcyIsImVudHJ5UG9pbnRzIiwiZXh0ZXJuYWwiLCJidWlsdGluTW9kdWxlcyIsIm1pbmlmeSIsIm91dEV4dGVuc2lvbiIsInBsYXRmb3JtIiwicGx1Z2lucyIsImVzcHJvdG8iLCJwb3BDb3B5IiwicmVzb2x2ZUV4dGVuc2lvbnMiLCJzb3VyY2VtYXAiLCJ0YXJnZXQiLCJ3YXRjaCIsIm9uUmVidWlsZCIsImVycm9yIiwid3JpdGUiLCJidWlsZFJlc3VsdCIsImVzYnVpbGQiLCJidWlsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUEsTUFBTUEsZ0JBQWdCLEdBQUcsT0FBekI7QUFDQSxNQUFNQyxZQUFZLEdBQUcsTUFBckI7QUFDQSxNQUFNQyxLQUFLLEdBQUdGLGdCQUFnQixHQUFHQyxZQUFqQztBQUNBLE1BQU1FLGdCQUFnQixHQUFHLGVBQXpCOztBQUNBLE1BQU1DLE1BQU0sR0FBR0MsY0FBS0MsT0FBTCxDQUFhLE1BQWIsQ0FBZjs7QUFDQSxNQUFNQyxXQUFXLEdBQUdILE1BQU0sR0FBRyxHQUFULEdBQWVELGdCQUFuQztBQUVBLE1BQU1LLFVBQVUsR0FBR0MsT0FBTyxDQUFDQyxRQUFSLENBQWlCQyxNQUFqQixDQUF3QkMsQ0FBQyxJQUFJQSxDQUFDLENBQUNDLFVBQUYsQ0FBYSxjQUFiLENBQTdCLENBQW5CO0FBQ0EsTUFBTUMsT0FBTyxHQUFHLENBQUMsQ0FBQ04sVUFBVSxDQUFDRyxNQUFYLENBQWtCQyxDQUFDLElBQUlBLENBQUMsQ0FBQ0csUUFBRixDQUFXLE9BQVgsQ0FBdkIsRUFBNENDLE1BQTlEO0FBQ0EsTUFBTUMsS0FBSyxHQUFHLENBQUNILE9BQWY7QUFHQSxJQUFJSSxPQUFPLEdBQUdDLFNBQWQ7O0FBQ0EsTUFBTUMsT0FBTyxHQUFHLFlBQVlILEtBQUssSUFBSUMsT0FBTyxFQUFFRixNQUFsQixJQUE0QkUsT0FBTyxDQUFDRyxPQUFSLENBQWdCQyxDQUFDLElBQUlBLENBQUMsQ0FBQ0MsS0FBRixFQUFyQixDQUF4RDs7QUFDQSxNQUFNQyxRQUFRLEdBQUcsWUFBWTtBQUMzQixNQUFJVixPQUFKLEVBQWE7QUFFYixRQUFPTSxPQUFPLEVBQWQ7QUFFQSxTQUFPSyxZQUFHQyxRQUFILENBQVlDLFFBQVosQ0FBcUJwQixXQUFyQixFQUFrQyxPQUFsQyxFQUNKcUIsSUFESSxDQUNDQyxRQUFRLHVCQUFXLFFBQVFDLElBQUksQ0FBQ0MsS0FBTCxDQUFXRixRQUFYLEVBQXFCN0IsZ0JBQXJCLENBQW5CLGdFQURULEVBRUo0QixJQUZJLENBRUMsTUFBTUksVUFBTixJQUFvQjtBQUN4QixRQUFJQSxVQUFKLEVBQWdCZCxPQUFPLEdBQUcsTUFBTWMsVUFBVSxDQUFDQyxNQUFYLEVBQWhCO0FBRWhCLFdBQU9mLE9BQVA7QUFDRCxHQU5JLENBQVA7QUFPRCxDQVpEOztBQWNBLE1BQU1nQixvQkFBb0IsR0FBRyxDQUFDO0FBQUVDLEVBQUFBLE1BQUY7QUFBVUMsRUFBQUEsUUFBVjtBQUFvQixLQUFHQztBQUF2QixDQUFELEtBQXFDO0FBQ2hFQyxFQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSx1QkFBYixFQUFzQ0MsTUFBTSxDQUFDQyxJQUFQLENBQVlKLE1BQU0sQ0FBQ0ssUUFBUCxDQUFnQkMsT0FBNUIsQ0FBdEM7QUFFQSxNQUFJUixNQUFNLENBQUNuQixNQUFQLElBQWlCb0IsUUFBUSxDQUFDcEIsTUFBOUIsRUFDRXNCLE9BQU8sQ0FBQ00sSUFBUixDQUFhLDBCQUFiLEVBQXlDO0FBQUVULElBQUFBLE1BQUY7QUFBVUMsSUFBQUE7QUFBVixHQUF6QztBQUVGLE1BQUluQixLQUFKLEVBQVdPLFFBQVEsR0FBbkIsS0FDSyxJQUFJVixPQUFKLEVBQWF1QixNQUFNLENBQUNRLElBQVA7QUFDbkIsQ0FSRDs7QUFVQSxNQUFNQyxhQUFhLEdBQUc7QUFDcEJDLEVBQUFBLE9BQU8sRUFBRSxDQUNQO0FBQ0VDLElBQUFBLFVBQVUsRUFBRSxzQkFEZDtBQUVFQyxJQUFBQSxLQUFLLEVBQUUsQ0FBQyxNQUFNQyxlQUFRNUMsT0FBUixDQUFnQixRQUFoQixFQUEwQjZDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZQyxHQUF0QyxDQUFQLEVBQW1EQyxPQUFuRCxDQUEyRCxTQUEzRCxFQUFzRSxFQUF0RSxDQUZUO0FBR0VsRCxJQUFBQSxNQUhGO0FBSUVtRCxJQUFBQSxPQUFPLEVBQUU7QUFKWCxHQURPO0FBRFcsQ0FBdEI7QUFXQSxNQUFNQyxvQkFBb0IsR0FBRztBQUMzQkMsRUFBQUEsYUFBYSxFQUFFLE9BRFk7QUFFM0JDLEVBQUFBLFFBQVEsRUFBRXZELGdCQUZpQjtBQUczQndELEVBQUFBLElBQUksRUFBRSxLQUhxQjtBQUkzQkMsRUFBQUEsVUFBVSxFQUFFO0FBSmUsQ0FBN0I7QUFXQSxNQUFNQyxhQUFhLEdBQUc7QUFDcEJDLEVBQUFBLFVBQVUsRUFBRSxzQkFEUTtBQUVwQkMsRUFBQUEsTUFBTSxFQUFFLElBRlk7QUFHcEJDLEVBQUFBLE1BQU0sRUFBRUMsZ0JBQVNDLE9BQVQsQ0FBaUJDLGdCQUFqQixFQUEwQkMsVUFIZDtBQUlwQkMsRUFBQUEsVUFBVSxFQUFFcEQsS0FBSyxHQUFHLGVBQUgsR0FBcUIsUUFKbEI7QUFLcEJxRCxFQUFBQSxXQUFXLEVBQUUsQ0FBQ3BFLEtBQUQsQ0FMTztBQU1wQnFFLEVBQUFBLFFBQVEsRUFBRUMsc0JBTlU7QUFPcEI5QixFQUFBQSxRQUFRLEVBQUUsSUFQVTtBQVFwQitCLEVBQUFBLE1BQU0sRUFBRSxLQVJZO0FBU3BCckUsRUFBQUEsTUFUb0I7QUFVcEJzRSxFQUFBQSxZQUFZLEVBQUU7QUFBRSxXQUFPO0FBQVQsR0FWTTtBQVdwQkMsRUFBQUEsUUFBUSxFQUFFLE1BWFU7QUFZcEJDLEVBQUFBLE9BQU8sRUFBRSxDQUFFQyxlQUFRQyxPQUFSLENBQWdCaEMsYUFBaEIsQ0FBRixFQUFrQyxvQ0FBZVUsb0JBQWYsQ0FBbEMsQ0FaVztBQWFwQnVCLEVBQUFBLGlCQUFpQixFQUFFLENBQUMsTUFBRCxFQUFTLEtBQVQsRUFBZ0IsTUFBaEIsRUFBd0IsT0FBeEIsQ0FiQztBQWNwQkMsRUFBQUEsU0FBUyxFQUFFLElBZFM7QUFlcEJDLEVBQUFBLE1BQU0sRUFBRSxDQUFDLGFBQUQsQ0FmWTtBQWdCcEJDLEVBQUFBLEtBQUssRUFBRTtBQUNMLFVBQU1DLFNBQU4sQ0FBZ0JDLEtBQWhCLEVBQXVCL0MsTUFBdkIsRUFBK0I7QUFDN0JILE1BQUFBLG9CQUFvQixDQUFDRyxNQUFELENBQXBCO0FBRUEsVUFBSStDLEtBQUosRUFBVzlDLE9BQU8sQ0FBQzhDLEtBQVIsQ0FBY0EsS0FBZDtBQUNaOztBQUxJLEdBaEJhO0FBdUJwQkMsRUFBQUEsS0FBSyxFQUFFO0FBdkJhLENBQXRCO0FBNkJBLE1BQU1DLFdBQVcsR0FBRyxNQUFNQyxpQkFBUUMsS0FBUixDQUFjM0IsYUFBZCxDQUExQjtBQUNBL0MsT0FBTyxJQUFJb0Isb0JBQW9CLENBQUNvRCxXQUFELENBQS9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYnVpbHRpbk1vZHVsZXMgfSBmcm9tICdtb2R1bGUnO1xuaW1wb3J0IHsgZW52cHJvdG8sIGVzcHJvdG8sIGZzcHJvdG8gfSBmcm9tICdAbm9kZXByb3RvL3V0aWxzJztcblxuaW1wb3J0IGVzYnVpbGQgZnJvbSAnZXNidWlsZCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IG1hbmlmZXN0UGx1Z2luIGZyb20gJ2VzYnVpbGQtcGx1Z2luLW1hbmlmZXN0JztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHBrZ0pzb24gZnJvbSAnLi4vcGFja2FnZS5qc29uJztcblxuY29uc3QgYXBwSW5wdXRGaWxlbmFtZSA9ICdpbmRleCc7XG5jb25zdCBhcHBFeHRlbnNpb24gPSAnLm1qcyc7XG5jb25zdCBhcHBJZCA9IGFwcElucHV0RmlsZW5hbWUgKyBhcHBFeHRlbnNpb247XG5jb25zdCBtYW5pZmVzdEZpbGVuYW1lID0gJ21hbmlmZXN0Lmpzb24nO1xuY29uc3Qgb3V0ZGlyID0gcGF0aC5yZXNvbHZlKCdkaXN0Jyk7XG5jb25zdCBtYW5pZmVzdFVyaSA9IG91dGRpciArICcvJyArIG1hbmlmZXN0RmlsZW5hbWU7XG5cbmNvbnN0IGNvbmRpdGlvbnMgPSBwcm9jZXNzLmV4ZWNBcmd2LmZpbHRlcih4ID0+IHguc3RhcnRzV2l0aCgnLS1jb25kaXRpb25zJykpO1xuY29uc3QgaXNCdWlsZCA9ICEhY29uZGl0aW9ucy5maWx0ZXIoeCA9PiB4LmVuZHNXaXRoKCdidWlsZCcpKS5sZW5ndGg7XG5jb25zdCBpc0RldiA9ICFpc0J1aWxkOyAvLyBjYW50IGJlIGJvdGggZGV2IGFuZCBidWlsZFxuXG4vLyBmb3IgYXV0byBzdGFydGluZyBpbiBkZXZcbmxldCBzZXJ2ZXJzID0gdW5kZWZpbmVkO1xuY29uc3Qgc3RvcERldiA9IGFzeW5jICgpID0+IGlzRGV2ICYmIHNlcnZlcnM/Lmxlbmd0aCAmJiBzZXJ2ZXJzLmZvckVhY2gocyA9PiBzLmNsb3NlKCkpO1xuY29uc3Qgc3RhcnREZXYgPSBhc3luYyAoKSA9PiB7XG4gIGlmIChpc0J1aWxkKSByZXR1cm47XG5cbiAgYXdhaXQgKHN0b3BEZXYoKSk7XG5cbiAgcmV0dXJuIGZzLnByb21pc2VzLnJlYWRGaWxlKG1hbmlmZXN0VXJpLCAndXRmLTgnKVxuICAgIC50aGVuKG1hbmlmZXN0ID0+IGltcG9ydCgnLi4vJyArIEpTT04ucGFyc2UobWFuaWZlc3QpW2FwcElucHV0RmlsZW5hbWVdKSlcbiAgICAudGhlbihhc3luYyBuZXdTZXJ2ZXJzID0+IHtcbiAgICAgIGlmIChuZXdTZXJ2ZXJzKSBzZXJ2ZXJzID0gYXdhaXQgbmV3U2VydmVycy5ydW5BcHAoKTtcblxuICAgICAgcmV0dXJuIHNlcnZlcnM7XG4gICAgfSk7XG59O1xuXG5jb25zdCBidWlsZExvZ0FuZERldk9yU3RvcCA9ICh7IGVycm9ycywgd2FybmluZ3MsIC4uLnJlc3VsdCB9KSA9PiB7XG4gIGNvbnNvbGUuaW5mbygnXFxuXFxuIGZpbmlzaGVkIGJ1aWxkXFxuJywgT2JqZWN0LmtleXMocmVzdWx0Lm1ldGFmaWxlLm91dHB1dHMpKTtcblxuICBpZiAoZXJyb3JzLmxlbmd0aCB8fCB3YXJuaW5ncy5sZW5ndGgpXG4gICAgY29uc29sZS53YXJuKCdcXG5cXG4gYnVpbGQgbm90aWZpY2F0aW9ucycsIHsgZXJyb3JzLCB3YXJuaW5ncyB9KTtcblxuICBpZiAoaXNEZXYpIHN0YXJ0RGV2KCk7XG4gIGVsc2UgaWYgKGlzQnVpbGQpIHJlc3VsdC5zdG9wKCk7XG59O1xuXG5jb25zdCBwb3BDb3B5Q29uZmlnID0ge1xuICBvcHRpb25zOiBbXG4gICAge1xuICAgICAgZW5kaW5nV2l0aDogL29wZW5hcGlcXC4oeW1sfHlhbWwpJC8sXG4gICAgICBpbmRpcjogKGF3YWl0IGZzcHJvdG8ucmVzb2x2ZSgnLi4vYXBwJywgaW1wb3J0Lm1ldGEudXJsKSkucmVwbGFjZSgnZmlsZTovLycsICcnKSxcbiAgICAgIG91dGRpcixcbiAgICAgIHJlY3Vyc2U6IHRydWUsXG4gICAgfSxcbiAgXSxcbn07XG5cbmNvbnN0IG1hbmlmZXN0UGx1Z2luQ29uZmlnID0ge1xuICBleHRlbnNpb25sZXNzOiAnaW5wdXQnLFxuICBmaWxlbmFtZTogbWFuaWZlc3RGaWxlbmFtZSxcbiAgaGFzaDogZmFsc2UsXG4gIHNob3J0TmFtZXM6IGZhbHNlLFxufTtcblxuLy8gY29uc3QgZW52ID0gZW52cHJvdG8uc3luY0Vudihwa2dKc29uKTtcblxuLy8gY29uc29sZS5sb2coJ1xcblxcbiBnb3QgZW52JywgZW52KTtcblxuY29uc3QgZXNidWlsZENvbmZpZyA9IHtcbiAgYXNzZXROYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdJyxcbiAgYnVuZGxlOiB0cnVlLFxuICBkZWZpbmU6IGVudnByb3RvLnN5bmNFbnYocGtnSnNvbikucHJvY2Vzc0VudixcbiAgZW50cnlOYW1lczogaXNEZXYgPyAnW25hbWVdLVtoYXNoXScgOiAnW25hbWVdJyxcbiAgZW50cnlQb2ludHM6IFthcHBJZF0sXG4gIGV4dGVybmFsOiBidWlsdGluTW9kdWxlcyxcbiAgbWV0YWZpbGU6IHRydWUsXG4gIG1pbmlmeTogZmFsc2UsXG4gIG91dGRpcixcbiAgb3V0RXh0ZW5zaW9uOiB7ICcuanMnOiAnLmNqcycgfSxcbiAgcGxhdGZvcm06ICdub2RlJyxcbiAgcGx1Z2luczogWyBlc3Byb3RvLnBvcENvcHkocG9wQ29weUNvbmZpZyksIG1hbmlmZXN0UGx1Z2luKG1hbmlmZXN0UGx1Z2luQ29uZmlnKSBdLFxuICByZXNvbHZlRXh0ZW5zaW9uczogWycubWpzJywgJy5qcycsICcuY2pzJywgJy5qc29uJ10sXG4gIHNvdXJjZW1hcDogdHJ1ZSxcbiAgdGFyZ2V0OiBbJ25vZGUxNC4xNy4wJ10sIC8vIExUU1xuICB3YXRjaDoge1xuICAgIGFzeW5jIG9uUmVidWlsZChlcnJvciwgcmVzdWx0KSB7XG4gICAgICBidWlsZExvZ0FuZERldk9yU3RvcChyZXN1bHQpO1xuXG4gICAgICBpZiAoZXJyb3IpIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgIH1cbiAgfSxcbiAgd3JpdGU6IHRydWUsXG4gIC8vIGZvcm1hdDogJ2lpZScsXG4gIC8vIG91dGZpbGU6ICdkaXN0L291dC5janMnLFxufTtcblxuXG5jb25zdCBidWlsZFJlc3VsdCA9IGF3YWl0IGVzYnVpbGQuYnVpbGQoZXNidWlsZENvbmZpZyk7XG5pc0J1aWxkICYmIGJ1aWxkTG9nQW5kRGV2T3JTdG9wKGJ1aWxkUmVzdWx0KTsgLy8gaXNEZXYgaGFuZGxlZCBieSB3YXRjaC5vblJlYnVpbGRcbiJdfQ==
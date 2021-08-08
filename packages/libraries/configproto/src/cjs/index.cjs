"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;

exports.__esModule = true;
exports.setupWebpackConfig = exports.serverWebpack = exports.reactEsbuildWebpackConfig = exports.reactDevWebpackConfig = exports.FlowTypeCleaner = exports.buildWebpackConfig = exports.baseWebpackConfig = void 0;

var _baseWebpackConfig = _interopRequireDefault(require("./base.webpack.config.mjs"));

exports.baseWebpackConfig = _baseWebpackConfig.default;

var _buildWebpackConfig = _interopRequireDefault(require("./build.webpack.config.mjs"));

exports.buildWebpackConfig = _buildWebpackConfig.default;

var _FlowTypeCleaner = _interopRequireDefault(require("./loader/FlowTypeCleaner.cjs"));

exports.FlowTypeCleaner = _FlowTypeCleaner.default;

var _reactDevWebpackConfig = _interopRequireDefault(require("./react.dev.webpack.config.mjs"));

exports.reactDevWebpackConfig = _reactDevWebpackConfig.default;

var _reactEsbuildWebpackConfig = _interopRequireDefault(require("./react.esbuild.webpack.config.mjs"));

exports.reactEsbuildWebpackConfig = _reactEsbuildWebpackConfig.default;

var _serverWebpack = _interopRequireDefault(require("./bff/server.webpack.mjs"));

exports.serverWebpack = _serverWebpack.default;

var _setupWebpackConfig = _interopRequireDefault(require("./setup.webpack.config.mjs"));

exports.setupWebpackConfig = _setupWebpackConfig.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3dlYnBhY2svaW5kZXgubWpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIlxuLy8gZXhwb3J0IHsgZGVmYXVsdCBhcyBwcm9kV2VicGFja0NvbmZpZyB9IGZyb20gJy4vcHJvZC53ZWJwYWNrLmNvbmZpZy5tanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBiYXNlV2VicGFja0NvbmZpZyB9IGZyb20gJy4vYmFzZS53ZWJwYWNrLmNvbmZpZy5tanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBidWlsZFdlYnBhY2tDb25maWcgfSBmcm9tICcuL2J1aWxkLndlYnBhY2suY29uZmlnLm1qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEZsb3dUeXBlQ2xlYW5lciB9IGZyb20gJy4vbG9hZGVyL0Zsb3dUeXBlQ2xlYW5lci5janMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyByZWFjdERldldlYnBhY2tDb25maWcgfSBmcm9tICcuL3JlYWN0LmRldi53ZWJwYWNrLmNvbmZpZy5tanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyByZWFjdEVzYnVpbGRXZWJwYWNrQ29uZmlnIH0gZnJvbSAnLi9yZWFjdC5lc2J1aWxkLndlYnBhY2suY29uZmlnLm1qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHNlcnZlcldlYnBhY2sgfSBmcm9tICcuL2JmZi9zZXJ2ZXIud2VicGFjay5tanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzZXR1cFdlYnBhY2tDb25maWcgfSBmcm9tICcuL3NldHVwLndlYnBhY2suY29uZmlnLm1qcyc7XG4iXX0=
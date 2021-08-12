"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;

exports.__esModule = true;
exports.default = webpackEsbuildClient;

var _esbuildLoader = require("esbuild-loader");

var _esbuild = _interopRequireDefault(require("esbuild"));

var _webpack = _interopRequireDefault(require("webpack"));

// import HtmlWebpackPlugin from 'html-webpack-plugin';
const {
  ProvidePlugin
} = _webpack.default;

const isR = arg => {
  throw new Error(`${arg} is required in react.esbuild.webpack.config.mjs`);
}; // @see https://github.com/privatenumber/esbuild-loader-examples


function webpackEsbuildClient({
  entry = isR('entry'),
  outputDir = isR('outputDir'),
  htmlOptions = isR('htmlOptions'),
  HtmlWebpackPlugin = isR('HtmlWebpackPlugin'),
  ...options
} = {}) {
  return {
    entry,
    mode: 'development',
    module: {
      rules: [{
        exclude: /node_modules/,
        test: /\.(c|m)?jsx?$/,
        use: [{
          loader: 'esbuild-loader',
          options: {
            implementation: _esbuild.default,
            loader: 'jsx',
            target: 'es2015'
          }
        }, {
          loader: 'babel-loader',
          options: {
            configFile: '@nodeproto/configproto/babel/flow'
          }
        }]
      }]
    },
    optimization: {
      minimize: false,
      minimizer: [new _esbuildLoader.ESBuildMinifyPlugin()]
    },
    output: {
      libraryTarget: 'commonjs',
      path: outputDir
    },
    plugins: [new HtmlWebpackPlugin(htmlOptions), new ProvidePlugin({
      React: 'react'
    })],
    ...options
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3dlYnBhY2svcmVhY3QuZXNidWlsZC53ZWJwYWNrLmNvbmZpZy5tanMiXSwibmFtZXMiOlsiUHJvdmlkZVBsdWdpbiIsIndlYnBhY2siLCJpc1IiLCJhcmciLCJFcnJvciIsIndlYnBhY2tFc2J1aWxkQ2xpZW50IiwiZW50cnkiLCJvdXRwdXREaXIiLCJodG1sT3B0aW9ucyIsIkh0bWxXZWJwYWNrUGx1Z2luIiwib3B0aW9ucyIsIm1vZGUiLCJtb2R1bGUiLCJydWxlcyIsImV4Y2x1ZGUiLCJ0ZXN0IiwidXNlIiwibG9hZGVyIiwiaW1wbGVtZW50YXRpb24iLCJ0YXJnZXQiLCJjb25maWdGaWxlIiwib3B0aW1pemF0aW9uIiwibWluaW1pemUiLCJtaW5pbWl6ZXIiLCJFU0J1aWxkTWluaWZ5UGx1Z2luIiwib3V0cHV0IiwibGlicmFyeVRhcmdldCIsInBhdGgiLCJwbHVnaW5zIiwiUmVhY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFIQTtBQUtBLE1BQU07QUFBRUEsRUFBQUE7QUFBRixJQUFvQkMsZ0JBQTFCOztBQUVBLE1BQU1DLEdBQUcsR0FBR0MsR0FBRyxJQUFJO0FBQ2pCLFFBQU0sSUFBSUMsS0FBSixDQUFXLEdBQUVELEdBQUksa0RBQWpCLENBQU47QUFDRCxDQUZELEMsQ0FJQTs7O0FBQ2UsU0FBU0Usb0JBQVQsQ0FBK0I7QUFDNUNDLEVBQUFBLEtBQUssR0FBR0osR0FBRyxDQUFDLE9BQUQsQ0FEaUM7QUFFNUNLLEVBQUFBLFNBQVMsR0FBR0wsR0FBRyxDQUFDLFdBQUQsQ0FGNkI7QUFHNUNNLEVBQUFBLFdBQVcsR0FBR04sR0FBRyxDQUFDLGFBQUQsQ0FIMkI7QUFJNUNPLEVBQUFBLGlCQUFpQixHQUFHUCxHQUFHLENBQUMsbUJBQUQsQ0FKcUI7QUFNNUMsS0FBR1E7QUFOeUMsSUFPMUMsRUFQVyxFQU9QO0FBQ04sU0FBTztBQUNMSixJQUFBQSxLQURLO0FBRUxLLElBQUFBLElBQUksRUFBRSxhQUZEO0FBR0xDLElBQUFBLE1BQU0sRUFBRTtBQUNOQyxNQUFBQSxLQUFLLEVBQUUsQ0FDTDtBQUNFQyxRQUFBQSxPQUFPLEVBQUUsY0FEWDtBQUVFQyxRQUFBQSxJQUFJLEVBQUUsZUFGUjtBQUdFQyxRQUFBQSxHQUFHLEVBQUUsQ0FDSDtBQUNFQyxVQUFBQSxNQUFNLEVBQUUsZ0JBRFY7QUFFRVAsVUFBQUEsT0FBTyxFQUFFO0FBQ1BRLFlBQUFBLGNBQWMsRUFBZEEsZ0JBRE87QUFFUEQsWUFBQUEsTUFBTSxFQUFFLEtBRkQ7QUFHUEUsWUFBQUEsTUFBTSxFQUFFO0FBSEQ7QUFGWCxTQURHLEVBU0g7QUFDRUYsVUFBQUEsTUFBTSxFQUFFLGNBRFY7QUFFRVAsVUFBQUEsT0FBTyxFQUFFO0FBQ1BVLFlBQUFBLFVBQVUsRUFBRTtBQURMO0FBRlgsU0FURztBQUhQLE9BREs7QUFERCxLQUhIO0FBMkJMQyxJQUFBQSxZQUFZLEVBQUU7QUFDWkMsTUFBQUEsUUFBUSxFQUFFLEtBREU7QUFFWkMsTUFBQUEsU0FBUyxFQUFFLENBQ1QsSUFBSUMsa0NBQUosRUFEUztBQUZDLEtBM0JUO0FBaUNMQyxJQUFBQSxNQUFNLEVBQUU7QUFBRUMsTUFBQUEsYUFBYSxFQUFFLFVBQWpCO0FBQTZCQyxNQUFBQSxJQUFJLEVBQUVwQjtBQUFuQyxLQWpDSDtBQWtDTHFCLElBQUFBLE9BQU8sRUFBRSxDQUNQLElBQUluQixpQkFBSixDQUFzQkQsV0FBdEIsQ0FETyxFQUVQLElBQUlSLGFBQUosQ0FBa0I7QUFDaEI2QixNQUFBQSxLQUFLLEVBQUU7QUFEUyxLQUFsQixDQUZPLENBbENKO0FBd0NMLE9BQUduQjtBQXhDRSxHQUFQO0FBMENEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IEh0bWxXZWJwYWNrUGx1Z2luIGZyb20gJ2h0bWwtd2VicGFjay1wbHVnaW4nO1xuaW1wb3J0IHsgRVNCdWlsZE1pbmlmeVBsdWdpbiB9IGZyb20gJ2VzYnVpbGQtbG9hZGVyJztcbmltcG9ydCBpbXBsZW1lbnRhdGlvbiBmcm9tICdlc2J1aWxkJztcbmltcG9ydCB3ZWJwYWNrIGZyb20gJ3dlYnBhY2snO1xuXG5jb25zdCB7IFByb3ZpZGVQbHVnaW4gfSA9IHdlYnBhY2s7XG5cbmNvbnN0IGlzUiA9IGFyZyA9PiB7XG4gIHRocm93IG5ldyBFcnJvcihgJHthcmd9IGlzIHJlcXVpcmVkIGluIHJlYWN0LmVzYnVpbGQud2VicGFjay5jb25maWcubWpzYCk7XG59O1xuXG4vLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9wcml2YXRlbnVtYmVyL2VzYnVpbGQtbG9hZGVyLWV4YW1wbGVzXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB3ZWJwYWNrRXNidWlsZENsaWVudCAoe1xuICBlbnRyeSA9IGlzUignZW50cnknKSxcbiAgb3V0cHV0RGlyID0gaXNSKCdvdXRwdXREaXInKSxcbiAgaHRtbE9wdGlvbnMgPSBpc1IoJ2h0bWxPcHRpb25zJyksXG4gIEh0bWxXZWJwYWNrUGx1Z2luID0gaXNSKCdIdG1sV2VicGFja1BsdWdpbicpLFxuXG4gIC4uLm9wdGlvbnNcbn0gPSB7fSkge1xuICByZXR1cm4ge1xuICAgIGVudHJ5LFxuICAgIG1vZGU6ICdkZXZlbG9wbWVudCcsXG4gICAgbW9kdWxlOiB7XG4gICAgICBydWxlczogW1xuICAgICAgICB7XG4gICAgICAgICAgZXhjbHVkZTogL25vZGVfbW9kdWxlcy8sXG4gICAgICAgICAgdGVzdDogL1xcLihjfG0pP2pzeD8kLyxcbiAgICAgICAgICB1c2U6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbG9hZGVyOiAnZXNidWlsZC1sb2FkZXInLFxuICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgaW1wbGVtZW50YXRpb24sXG4gICAgICAgICAgICAgICAgbG9hZGVyOiAnanN4JyxcbiAgICAgICAgICAgICAgICB0YXJnZXQ6ICdlczIwMTUnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbG9hZGVyOiAnYmFiZWwtbG9hZGVyJyxcbiAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgIGNvbmZpZ0ZpbGU6ICdAbm9kZXByb3RvL2NvbmZpZ3Byb3RvL2JhYmVsL2Zsb3cnXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAgb3B0aW1pemF0aW9uOiB7XG4gICAgICBtaW5pbWl6ZTogZmFsc2UsXG4gICAgICBtaW5pbWl6ZXI6IFtcbiAgICAgICAgbmV3IEVTQnVpbGRNaW5pZnlQbHVnaW4oKSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBvdXRwdXQ6IHsgbGlicmFyeVRhcmdldDogJ2NvbW1vbmpzJywgcGF0aDogb3V0cHV0RGlyIH0sXG4gICAgcGx1Z2luczogW1xuICAgICAgbmV3IEh0bWxXZWJwYWNrUGx1Z2luKGh0bWxPcHRpb25zKSxcbiAgICAgIG5ldyBQcm92aWRlUGx1Z2luKHtcbiAgICAgICAgUmVhY3Q6ICdyZWFjdCcsXG4gICAgICB9KSxcbiAgICBdLFxuICAgIC4uLm9wdGlvbnMsXG4gIH07XG59XG4iXX0=
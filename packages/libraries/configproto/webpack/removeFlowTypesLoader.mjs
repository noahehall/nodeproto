// @copypasta: https://github.com/conorhastings/remove-flow-types-loader
// @see https://webpack.js.org/contribute/writing-a-loader/
const flowRemoveTypes = require('flow-remove-types');
const loaderUtils = require('loader-utils');

module.exports = function (source) {
  this.cacheable();

  const options = { ...loaderUtils.getOptions(this) };

  return flowRemoveTypes(source, options).toString();
};

// @see https://webpack.js.org/contribute/writing-a-loader/#testing

const flowRemoveTypes = require('flow-remove-types');

// @see https://github.com/conorhastings/remove-flow-types-loader/blob/master/index.js
module.exports = function (source) {
  this.cacheable();

  return flowRemoveTypes(source, {}).toString();
};

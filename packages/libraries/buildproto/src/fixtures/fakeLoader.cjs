// @FlowTODO

// @see https://webpack.js.org/contribute/writing-a-loader/#testing

// @see https://github.com/conorhastings/remove-flow-types-loader/blob/master/index.js
module.exports = function (source) {
  this.cacheable();

  return require("flow-remove-types")(source, {}).toString();
};

// @see https://webpack.js.org/contribute/writing-a-loader/#testing

import flowRemoveTypes from 'flow-remove-types';

// @see https://github.com/conorhastings/remove-flow-types-loader/blob/master/index.js
export default function (source) {
  console.info('\n\n src', source);

  this.cacheable();

  return flowRemoveTypes(source, {}).toString();
}

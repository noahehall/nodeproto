// inspiration: https://github.com/conorhastings/remove-flow-types-loader
// @see https://github.com/facebook/flow/tree/main/packages/flow-remove-types
// @see https://webpack.js.org/contribute/writing-a-loader/
// @see https://webpack.js.org/api/loaders/
// @see https://github.com/webpack/loader-utils/blob/master/package.json
// @see https://github.com/webpack/schema-utils/blob/master/package.json


// copypasta
// multiple loaders are executed in reverse order (right>left|bottom>up)
// The fact that loaders can be chained also means they don't necessarily have to output JavaScript. As long as the next loader in the chain can handle its output, the loader can return any type of module.


/** webpack best loader best practices
    Keep them simple.
    Utilize chaining.
    Emit modular output.
    Make sure they're stateless.
    Employ loader utilities.
    Mark loader dependencies.
    Resolve module dependencies.
    Extract common code.
    Avoid absolute paths.
    Use peer dependencies.
*/

import { validate } from 'schema-utils';
import flowRemoveTypes from 'flow-remove-types'; // TODO: wtf happened to eslint/sort-imports ?


/**
 * @export
 * @param {string} content represents content of the resource file
 * @param {*} map? when more than 1 loader applied to resource
 * @param {*} meta? when more than 1 loader applied to resource
 * @return {string, sourceMap?}
 */
export default function FlowRMTLoader (content /*, map, meta*/) {
  // async example
    // var callback = this.async();
    // someAsyncOperation(content, function (err, result) {
    //   if (err) return callback(err);
    //   callback(null, result, map, meta);
    // });
    // var headerPath = path.resolve('header.js');
    // this.addDependency(headerPath);

  // Synchronous loaders can return a single value representing the transformed module
  // can return any number of values by using the this.callback(err, values...)
  // const src = flowRemoveTypes(content, this.upsertOptions());
  // console.info('\n\n got src', src.toString());

  return () => flowRemoveTypes(content, this._upsertOptions()).toString();
}

FlowRMTLoader.prototype.displayName = 'FlowRMTLoader';
FlowRMTLoader.prototype._schema = {
  type: 'object',
  properties: {
    exclude: { type: 'array' },
    include: { type: 'array' },
    all: { type: 'boolean' },
  },
};

FlowRMTLoader.prototype._options = {
  exclude: [/node_modules/],
  include: [/\.(c|m|)jsx?/],
  all: true
};

FlowRMTLoader.prototype._upsertOptions = function () {
  try {
    const flowOptions = { ...this._options, ...this.getOptions(this._schema) };

    validate(this._schema, flowOptions, {
      name: this.displayName,
      baseDataPath: 'options'
    });

    return flowOptions;
  } catch { return this._options; }
};

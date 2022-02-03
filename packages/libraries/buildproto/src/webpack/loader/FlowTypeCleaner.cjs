// // inspiration: https://github.com/conorhastings/remove-flow-types-loader
// // @see https://github.com/facebook/flow/tree/main/packages/flow-remove-types
// // @see https://webpack.js.org/contribute/writing-a-loader/
// // @see https://webpack.js.org/api/loaders/
// // @see https://github.com/webpack/loader-utils/blob/master/package.json
// // @see https://github.com/webpack/schema-utils/blob/master/package.json

// // copypasta
// // multiple loaders are executed in reverse order (right>left|bottom>up)
// // The fact that loaders can be chained also means they don't necessarily have to output JavaScript. As long as the next loader in the chain can handle its output, the loader can return any type of module.

// /** webpack best loader best practices
//     Keep them simple.
//     Utilize chaining.
//     Emit modular output.
//     Make sure they're stateless.
//     Employ loader utilities.
//     Mark loader dependencies.
//     Resolve module dependencies.
//     Extract common code.
//     Avoid absolute paths.
//     Use peer dependencies.
// */

// const { validate } = require('schema-utils');
// const flowRemoveTypes = require('flow-remove-types');

// const _schema = {
//   type: 'object',
//   properties: {
//     exclude: { type: 'array' },
//     include: { type: 'array' },
//     all: { type: 'boolean' },
//   },
// };

// const _options = {
//   exclude: [/node_modules/],
//   include: [/\.(c|m|)jsx?/],
//   all: true,
// };

// const _upsertOptions = function () {
//   try {
//     const flowOptions = { ..._options, ...this.getOptions(_schema) };

//     validate(_schema, flowOptions, {
//       name: this.displayName,
//       baseDataPath: 'options',
//     });

//     return flowOptions;
//   } catch {
//     return _options;
//   }
// };

// /**
//  * @export
//  * @param {string} content represents content of the resource file
//  * @param {*} map? when more than 1 loader applied to resource
//  * @param {*} meta? when more than 1 loader applied to resource
//  * @return {string, sourceMap?}
//  */
// function FlowTypeCleanerLoader(content /*, map, meta*/) {
//   // this.cacheable();

//   return flowRemoveTypes(content, _upsertOptions()).toString();
// }

// FlowTypeCleanerLoader.displayName = 'FlowTypeCleanerLoader';

// module.exports = FlowTypeCleanerLoader;

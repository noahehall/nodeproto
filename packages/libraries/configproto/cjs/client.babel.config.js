function clientBabelConfig(a){null==a||a.cache(()=>isProd);const b=[["@babel/preset-env",{targets:{browsers:"last 2 versions, > 5%"},useBuiltIns:"usage",bugfixes:!0,corejs,modules:!1,debug:!isProd}],["@babel/preset-react",{runtime:"classic",development:!isProd}],["@babel/preset-flow"],].filter(c=>c),d=[["@babel/plugin-transform-runtime",{absoluteRuntime:!1,corejs,helpers:!0,regenerator:!0,version:pkgJson.dependencies["@babel/runtime-corejs3"]}],["babel-plugin-styled-components",{displayName:!isProd,fileName:!isProd,minify:isProd,namespace:"nirv",pure:isProd,srr:!1,transpileTemplateLiterals:isProd}],"tailcall-optimization","@babel/plugin-transform-react-constant-elements",isProd&&"@babel/plugin-transform-react-inline-elements",].filter(e=>e);return{assumptions,presets,plugins}}"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=clientBabelConfig;const corejs={version:3,proposals:!0},isProd="production"===process.env.NODE_ENV
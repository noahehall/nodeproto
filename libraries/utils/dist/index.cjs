var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// ../../common/temp/node_modules/.pnpm/dotenv@10.0.0/node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "../../common/temp/node_modules/.pnpm/dotenv@10.0.0/node_modules/dotenv/lib/main.js"(exports, module2) {
    var fs3 = require("fs");
    var path5 = require("path");
    var os = require("os");
    function log(message) {
      console.log(`[dotenv][DEBUG] ${message}`);
    }
    var NEWLINE = "\n";
    var RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;
    var RE_NEWLINES = /\\n/g;
    var NEWLINES_MATCH = /\r\n|\n|\r/;
    function parse(src, options) {
      const debug = Boolean(options && options.debug);
      const obj = {};
      src.toString().split(NEWLINES_MATCH).forEach(function(line, idx) {
        const keyValueArr = line.match(RE_INI_KEY_VAL);
        if (keyValueArr != null) {
          const key = keyValueArr[1];
          let val = keyValueArr[2] || "";
          const end = val.length - 1;
          const isDoubleQuoted = val[0] === '"' && val[end] === '"';
          const isSingleQuoted = val[0] === "'" && val[end] === "'";
          if (isSingleQuoted || isDoubleQuoted) {
            val = val.substring(1, end);
            if (isDoubleQuoted) {
              val = val.replace(RE_NEWLINES, NEWLINE);
            }
          } else {
            val = val.trim();
          }
          obj[key] = val;
        } else if (debug) {
          log(`did not match key and value when parsing line ${idx + 1}: ${line}`);
        }
      });
      return obj;
    }
    function resolveHome(envPath) {
      return envPath[0] === "~" ? path5.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function config(options) {
      let dotenvPath = path5.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      let debug = false;
      if (options) {
        if (options.path != null) {
          dotenvPath = resolveHome(options.path);
        }
        if (options.encoding != null) {
          encoding = options.encoding;
        }
        if (options.debug != null) {
          debug = true;
        }
      }
      try {
        const parsed2 = parse(fs3.readFileSync(dotenvPath, { encoding }), { debug });
        Object.keys(parsed2).forEach(function(key) {
          if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
            process.env[key] = parsed2[key];
          } else if (debug) {
            log(`"${key}" is already defined in \`process.env\` and will not be overwritten`);
          }
        });
        return { parsed: parsed2 };
      } catch (e) {
        return { error: e };
      }
    }
    module2.exports.config = config;
    module2.exports.parse = parse;
  }
});

// ../../common/temp/node_modules/.pnpm/mkdirp@1.0.4/node_modules/mkdirp/lib/opts-arg.js
var require_opts_arg = __commonJS({
  "../../common/temp/node_modules/.pnpm/mkdirp@1.0.4/node_modules/mkdirp/lib/opts-arg.js"(exports, module2) {
    var { promisify } = require("util");
    var fs3 = require("fs");
    var optsArg = (opts) => {
      if (!opts)
        opts = { mode: 511, fs: fs3 };
      else if (typeof opts === "object")
        opts = __spreadValues({ mode: 511, fs: fs3 }, opts);
      else if (typeof opts === "number")
        opts = { mode: opts, fs: fs3 };
      else if (typeof opts === "string")
        opts = { mode: parseInt(opts, 8), fs: fs3 };
      else
        throw new TypeError("invalid options argument");
      opts.mkdir = opts.mkdir || opts.fs.mkdir || fs3.mkdir;
      opts.mkdirAsync = promisify(opts.mkdir);
      opts.stat = opts.stat || opts.fs.stat || fs3.stat;
      opts.statAsync = promisify(opts.stat);
      opts.statSync = opts.statSync || opts.fs.statSync || fs3.statSync;
      opts.mkdirSync = opts.mkdirSync || opts.fs.mkdirSync || fs3.mkdirSync;
      return opts;
    };
    module2.exports = optsArg;
  }
});

// ../../common/temp/node_modules/.pnpm/mkdirp@1.0.4/node_modules/mkdirp/lib/path-arg.js
var require_path_arg = __commonJS({
  "../../common/temp/node_modules/.pnpm/mkdirp@1.0.4/node_modules/mkdirp/lib/path-arg.js"(exports, module2) {
    var platform = process.env.__TESTING_MKDIRP_PLATFORM__ || process.platform;
    var { resolve: resolve2, parse } = require("path");
    var pathArg = (path5) => {
      if (/\0/.test(path5)) {
        throw Object.assign(new TypeError("path must be a string without null bytes"), {
          path: path5,
          code: "ERR_INVALID_ARG_VALUE"
        });
      }
      path5 = resolve2(path5);
      if (platform === "win32") {
        const badWinChars = /[*|"<>?:]/;
        const { root } = parse(path5);
        if (badWinChars.test(path5.substr(root.length))) {
          throw Object.assign(new Error("Illegal characters in path."), {
            path: path5,
            code: "EINVAL"
          });
        }
      }
      return path5;
    };
    module2.exports = pathArg;
  }
});

// ../../common/temp/node_modules/.pnpm/mkdirp@1.0.4/node_modules/mkdirp/lib/find-made.js
var require_find_made = __commonJS({
  "../../common/temp/node_modules/.pnpm/mkdirp@1.0.4/node_modules/mkdirp/lib/find-made.js"(exports, module2) {
    var { dirname } = require("path");
    var findMade = (opts, parent, path5 = void 0) => {
      if (path5 === parent)
        return Promise.resolve();
      return opts.statAsync(parent).then((st) => st.isDirectory() ? path5 : void 0, (er) => er.code === "ENOENT" ? findMade(opts, dirname(parent), parent) : void 0);
    };
    var findMadeSync = (opts, parent, path5 = void 0) => {
      if (path5 === parent)
        return void 0;
      try {
        return opts.statSync(parent).isDirectory() ? path5 : void 0;
      } catch (er) {
        return er.code === "ENOENT" ? findMadeSync(opts, dirname(parent), parent) : void 0;
      }
    };
    module2.exports = { findMade, findMadeSync };
  }
});

// ../../common/temp/node_modules/.pnpm/mkdirp@1.0.4/node_modules/mkdirp/lib/mkdirp-manual.js
var require_mkdirp_manual = __commonJS({
  "../../common/temp/node_modules/.pnpm/mkdirp@1.0.4/node_modules/mkdirp/lib/mkdirp-manual.js"(exports, module2) {
    var { dirname } = require("path");
    var mkdirpManual = (path5, opts, made) => {
      opts.recursive = false;
      const parent = dirname(path5);
      if (parent === path5) {
        return opts.mkdirAsync(path5, opts).catch((er) => {
          if (er.code !== "EISDIR")
            throw er;
        });
      }
      return opts.mkdirAsync(path5, opts).then(() => made || path5, (er) => {
        if (er.code === "ENOENT")
          return mkdirpManual(parent, opts).then((made2) => mkdirpManual(path5, opts, made2));
        if (er.code !== "EEXIST" && er.code !== "EROFS")
          throw er;
        return opts.statAsync(path5).then((st) => {
          if (st.isDirectory())
            return made;
          else
            throw er;
        }, () => {
          throw er;
        });
      });
    };
    var mkdirpManualSync = (path5, opts, made) => {
      const parent = dirname(path5);
      opts.recursive = false;
      if (parent === path5) {
        try {
          return opts.mkdirSync(path5, opts);
        } catch (er) {
          if (er.code !== "EISDIR")
            throw er;
          else
            return;
        }
      }
      try {
        opts.mkdirSync(path5, opts);
        return made || path5;
      } catch (er) {
        if (er.code === "ENOENT")
          return mkdirpManualSync(path5, opts, mkdirpManualSync(parent, opts, made));
        if (er.code !== "EEXIST" && er.code !== "EROFS")
          throw er;
        try {
          if (!opts.statSync(path5).isDirectory())
            throw er;
        } catch (_) {
          throw er;
        }
      }
    };
    module2.exports = { mkdirpManual, mkdirpManualSync };
  }
});

// ../../common/temp/node_modules/.pnpm/mkdirp@1.0.4/node_modules/mkdirp/lib/mkdirp-native.js
var require_mkdirp_native = __commonJS({
  "../../common/temp/node_modules/.pnpm/mkdirp@1.0.4/node_modules/mkdirp/lib/mkdirp-native.js"(exports, module2) {
    var { dirname } = require("path");
    var { findMade, findMadeSync } = require_find_made();
    var { mkdirpManual, mkdirpManualSync } = require_mkdirp_manual();
    var mkdirpNative = (path5, opts) => {
      opts.recursive = true;
      const parent = dirname(path5);
      if (parent === path5)
        return opts.mkdirAsync(path5, opts);
      return findMade(opts, path5).then((made) => opts.mkdirAsync(path5, opts).then(() => made).catch((er) => {
        if (er.code === "ENOENT")
          return mkdirpManual(path5, opts);
        else
          throw er;
      }));
    };
    var mkdirpNativeSync = (path5, opts) => {
      opts.recursive = true;
      const parent = dirname(path5);
      if (parent === path5)
        return opts.mkdirSync(path5, opts);
      const made = findMadeSync(opts, path5);
      try {
        opts.mkdirSync(path5, opts);
        return made;
      } catch (er) {
        if (er.code === "ENOENT")
          return mkdirpManualSync(path5, opts);
        else
          throw er;
      }
    };
    module2.exports = { mkdirpNative, mkdirpNativeSync };
  }
});

// ../../common/temp/node_modules/.pnpm/mkdirp@1.0.4/node_modules/mkdirp/lib/use-native.js
var require_use_native = __commonJS({
  "../../common/temp/node_modules/.pnpm/mkdirp@1.0.4/node_modules/mkdirp/lib/use-native.js"(exports, module2) {
    var fs3 = require("fs");
    var version = process.env.__TESTING_MKDIRP_NODE_VERSION__ || process.version;
    var versArr = version.replace(/^v/, "").split(".");
    var hasNative = +versArr[0] > 10 || +versArr[0] === 10 && +versArr[1] >= 12;
    var useNative = !hasNative ? () => false : (opts) => opts.mkdir === fs3.mkdir;
    var useNativeSync = !hasNative ? () => false : (opts) => opts.mkdirSync === fs3.mkdirSync;
    module2.exports = { useNative, useNativeSync };
  }
});

// ../../common/temp/node_modules/.pnpm/mkdirp@1.0.4/node_modules/mkdirp/index.js
var require_mkdirp = __commonJS({
  "../../common/temp/node_modules/.pnpm/mkdirp@1.0.4/node_modules/mkdirp/index.js"(exports, module2) {
    var optsArg = require_opts_arg();
    var pathArg = require_path_arg();
    var { mkdirpNative, mkdirpNativeSync } = require_mkdirp_native();
    var { mkdirpManual, mkdirpManualSync } = require_mkdirp_manual();
    var { useNative, useNativeSync } = require_use_native();
    var mkdirp2 = (path5, opts) => {
      path5 = pathArg(path5);
      opts = optsArg(opts);
      return useNative(opts) ? mkdirpNative(path5, opts) : mkdirpManual(path5, opts);
    };
    var mkdirpSync = (path5, opts) => {
      path5 = pathArg(path5);
      opts = optsArg(opts);
      return useNativeSync(opts) ? mkdirpNativeSync(path5, opts) : mkdirpManualSync(path5, opts);
    };
    mkdirp2.sync = mkdirpSync;
    mkdirp2.native = (path5, opts) => mkdirpNative(pathArg(path5), optsArg(opts));
    mkdirp2.manual = (path5, opts) => mkdirpManual(pathArg(path5), optsArg(opts));
    mkdirp2.nativeSync = (path5, opts) => mkdirpNativeSync(pathArg(path5), optsArg(opts));
    mkdirp2.manualSync = (path5, opts) => mkdirpManualSync(pathArg(path5), optsArg(opts));
    module2.exports = mkdirp2;
  }
});

// ../../common/temp/node_modules/.pnpm/es6-promisify@6.1.1/node_modules/es6-promisify/dist/promisify.js
var require_promisify = __commonJS({
  "../../common/temp/node_modules/.pnpm/es6-promisify@6.1.1/node_modules/es6-promisify/dist/promisify.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.promisify = promisify;
    var customArgumentsToken = "__ES6-PROMISIFY--CUSTOM-ARGUMENTS__";
    function promisify(original) {
      if (typeof original !== "function") {
        throw new TypeError("Argument to promisify must be a function");
      }
      var argumentNames = original[customArgumentsToken];
      var ES6Promise = promisify.Promise || Promise;
      if (typeof ES6Promise !== "function") {
        throw new Error("No Promise implementation found; do you need a polyfill?");
      }
      return function() {
        var _this = this;
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        return new ES6Promise(function(resolve2, reject) {
          args.push(function callback(err) {
            if (err) {
              return reject(err);
            }
            for (var _len2 = arguments.length, values = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
              values[_key2 - 1] = arguments[_key2];
            }
            if (values.length === 1 || !argumentNames) {
              return resolve2(values[0]);
            }
            var o = {};
            values.forEach(function(value, index) {
              var name2 = argumentNames[index];
              if (name2) {
                o[name2] = value;
              }
            });
            resolve2(o);
          });
          original.apply(_this, args);
        });
      };
    }
    promisify.argumentNames = customArgumentsToken;
    promisify.Promise = void 0;
  }
});

// ../../common/temp/node_modules/.pnpm/os-tmpdir@1.0.2/node_modules/os-tmpdir/index.js
var require_os_tmpdir = __commonJS({
  "../../common/temp/node_modules/.pnpm/os-tmpdir@1.0.2/node_modules/os-tmpdir/index.js"(exports, module2) {
    "use strict";
    var isWindows = process.platform === "win32";
    var trailingSlashRe = isWindows ? /[^:]\\$/ : /.\/$/;
    module2.exports = function() {
      var path5;
      if (isWindows) {
        path5 = process.env.TEMP || process.env.TMP || (process.env.SystemRoot || process.env.windir) + "\\temp";
      } else {
        path5 = process.env.TMPDIR || process.env.TMP || process.env.TEMP || "/tmp";
      }
      if (trailingSlashRe.test(path5)) {
        path5 = path5.slice(0, -1);
      }
      return path5;
    };
  }
});

// ../../common/temp/node_modules/.pnpm/pem@1.14.4/node_modules/pem/lib/helper.js
var require_helper = __commonJS({
  "../../common/temp/node_modules/.pnpm/pem@1.14.4/node_modules/pem/lib/helper.js"(exports, module2) {
    "use strict";
    var pathlib = require("path");
    var fs3 = require("fs");
    var crypto = require("crypto");
    var osTmpdir = require_os_tmpdir();
    var tempDir = process.env.PEMJS_TMPDIR || osTmpdir();
    module2.exports.isNumber = function(str) {
      if (Array.isArray(str)) {
        return false;
      }
      return /^\d+$/g.test(str);
    };
    module2.exports.isHex = function isHex(hex) {
      return /^(0x){0,1}([0-9A-F]{1,40}|[0-9A-F]{1,40})$/gi.test(hex);
    };
    module2.exports.toHex = function toHex(str) {
      var hex = "";
      for (var i = 0; i < str.length; i++) {
        hex += "" + str.charCodeAt(i).toString(16);
      }
      return hex;
    };
    module2.exports.ciphers = ["aes128", "aes192", "aes256", "camellia128", "camellia192", "camellia256", "des", "des3", "idea"];
    var ciphers = module2.exports.ciphers;
    module2.exports.createPasswordFile = function(options, params, PasswordFileArray) {
      if (!options || !Object.prototype.hasOwnProperty.call(options, "password") || !Object.prototype.hasOwnProperty.call(options, "passType") || !/^(word|in|out)$/.test(options.passType)) {
        return false;
      }
      var PasswordFile = pathlib.join(tempDir, crypto.randomBytes(20).toString("hex"));
      PasswordFileArray.push(PasswordFile);
      options.password = options.password.trim();
      if (options.password === "") {
        options.mustPass = true;
      }
      if (options.cipher && ciphers.indexOf(options.cipher) !== -1) {
        params.push("-" + options.cipher);
      }
      params.push("-pass" + options.passType);
      if (options.mustPass) {
        params.push("pass:" + options.password);
      } else {
        fs3.writeFileSync(PasswordFile, options.password);
        params.push("file:" + PasswordFile);
      }
      return true;
    };
    module2.exports.deleteTempFiles = function(files, callback) {
      var rmFiles = [];
      if (typeof files === "string") {
        rmFiles.push(files);
      } else if (Array.isArray(files)) {
        rmFiles = files;
      } else {
        return callback(new Error("Unexcepted files parameter type; only string or array supported"));
      }
      var deleteSeries = function(list, finalCallback) {
        if (list.length) {
          var file = list.shift();
          var myCallback = function(err) {
            if (err && err.code === "ENOENT") {
              return deleteSeries(list, finalCallback);
            } else if (err) {
              return finalCallback(err);
            } else {
              return deleteSeries(list, finalCallback);
            }
          };
          if (file && typeof file === "string") {
            fs3.unlink(file, myCallback);
          } else {
            return deleteSeries(list, finalCallback);
          }
        } else {
          return finalCallback(null);
        }
      };
      deleteSeries(rmFiles, callback);
    };
  }
});

// ../../common/temp/node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/windows.js
var require_windows = __commonJS({
  "../../common/temp/node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/windows.js"(exports, module2) {
    module2.exports = isexe;
    isexe.sync = sync;
    var fs3 = require("fs");
    function checkPathExt(path5, options) {
      var pathext = options.pathExt !== void 0 ? options.pathExt : process.env.PATHEXT;
      if (!pathext) {
        return true;
      }
      pathext = pathext.split(";");
      if (pathext.indexOf("") !== -1) {
        return true;
      }
      for (var i = 0; i < pathext.length; i++) {
        var p = pathext[i].toLowerCase();
        if (p && path5.substr(-p.length).toLowerCase() === p) {
          return true;
        }
      }
      return false;
    }
    function checkStat(stat, path5, options) {
      if (!stat.isSymbolicLink() && !stat.isFile()) {
        return false;
      }
      return checkPathExt(path5, options);
    }
    function isexe(path5, options, cb) {
      fs3.stat(path5, function(er, stat) {
        cb(er, er ? false : checkStat(stat, path5, options));
      });
    }
    function sync(path5, options) {
      return checkStat(fs3.statSync(path5), path5, options);
    }
  }
});

// ../../common/temp/node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/mode.js
var require_mode = __commonJS({
  "../../common/temp/node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/mode.js"(exports, module2) {
    module2.exports = isexe;
    isexe.sync = sync;
    var fs3 = require("fs");
    function isexe(path5, options, cb) {
      fs3.stat(path5, function(er, stat) {
        cb(er, er ? false : checkStat(stat, options));
      });
    }
    function sync(path5, options) {
      return checkStat(fs3.statSync(path5), options);
    }
    function checkStat(stat, options) {
      return stat.isFile() && checkMode(stat, options);
    }
    function checkMode(stat, options) {
      var mod = stat.mode;
      var uid = stat.uid;
      var gid = stat.gid;
      var myUid = options.uid !== void 0 ? options.uid : process.getuid && process.getuid();
      var myGid = options.gid !== void 0 ? options.gid : process.getgid && process.getgid();
      var u = parseInt("100", 8);
      var g = parseInt("010", 8);
      var o = parseInt("001", 8);
      var ug = u | g;
      var ret = mod & o || mod & g && gid === myGid || mod & u && uid === myUid || mod & ug && myUid === 0;
      return ret;
    }
  }
});

// ../../common/temp/node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/index.js
var require_isexe = __commonJS({
  "../../common/temp/node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/index.js"(exports, module2) {
    var fs3 = require("fs");
    var core;
    if (process.platform === "win32" || global.TESTING_WINDOWS) {
      core = require_windows();
    } else {
      core = require_mode();
    }
    module2.exports = isexe;
    isexe.sync = sync;
    function isexe(path5, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = {};
      }
      if (!cb) {
        if (typeof Promise !== "function") {
          throw new TypeError("callback not provided");
        }
        return new Promise(function(resolve2, reject) {
          isexe(path5, options || {}, function(er, is) {
            if (er) {
              reject(er);
            } else {
              resolve2(is);
            }
          });
        });
      }
      core(path5, options || {}, function(er, is) {
        if (er) {
          if (er.code === "EACCES" || options && options.ignoreErrors) {
            er = null;
            is = false;
          }
        }
        cb(er, is);
      });
    }
    function sync(path5, options) {
      try {
        return core.sync(path5, options || {});
      } catch (er) {
        if (options && options.ignoreErrors || er.code === "EACCES") {
          return false;
        } else {
          throw er;
        }
      }
    }
  }
});

// ../../common/temp/node_modules/.pnpm/which@2.0.2/node_modules/which/which.js
var require_which = __commonJS({
  "../../common/temp/node_modules/.pnpm/which@2.0.2/node_modules/which/which.js"(exports, module2) {
    var isWindows = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys";
    var path5 = require("path");
    var COLON = isWindows ? ";" : ":";
    var isexe = require_isexe();
    var getNotFoundError = (cmd) => Object.assign(new Error(`not found: ${cmd}`), { code: "ENOENT" });
    var getPathInfo = (cmd, opt) => {
      const colon = opt.colon || COLON;
      const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? [""] : [
        ...isWindows ? [process.cwd()] : [],
        ...(opt.path || process.env.PATH || "").split(colon)
      ];
      const pathExtExe = isWindows ? opt.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "";
      const pathExt = isWindows ? pathExtExe.split(colon) : [""];
      if (isWindows) {
        if (cmd.indexOf(".") !== -1 && pathExt[0] !== "")
          pathExt.unshift("");
      }
      return {
        pathEnv,
        pathExt,
        pathExtExe
      };
    };
    var which = (cmd, opt, cb) => {
      if (typeof opt === "function") {
        cb = opt;
        opt = {};
      }
      if (!opt)
        opt = {};
      const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
      const found = [];
      const step = (i) => new Promise((resolve2, reject) => {
        if (i === pathEnv.length)
          return opt.all && found.length ? resolve2(found) : reject(getNotFoundError(cmd));
        const ppRaw = pathEnv[i];
        const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
        const pCmd = path5.join(pathPart, cmd);
        const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
        resolve2(subStep(p, i, 0));
      });
      const subStep = (p, i, ii) => new Promise((resolve2, reject) => {
        if (ii === pathExt.length)
          return resolve2(step(i + 1));
        const ext = pathExt[ii];
        isexe(p + ext, { pathExt: pathExtExe }, (er, is) => {
          if (!er && is) {
            if (opt.all)
              found.push(p + ext);
            else
              return resolve2(p + ext);
          }
          return resolve2(subStep(p, i, ii + 1));
        });
      });
      return cb ? step(0).then((res) => cb(null, res), cb) : step(0);
    };
    var whichSync = (cmd, opt) => {
      opt = opt || {};
      const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
      const found = [];
      for (let i = 0; i < pathEnv.length; i++) {
        const ppRaw = pathEnv[i];
        const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
        const pCmd = path5.join(pathPart, cmd);
        const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
        for (let j = 0; j < pathExt.length; j++) {
          const cur = p + pathExt[j];
          try {
            const is = isexe.sync(cur, { pathExt: pathExtExe });
            if (is) {
              if (opt.all)
                found.push(cur);
              else
                return cur;
            }
          } catch (ex) {
          }
        }
      }
      if (opt.all && found.length)
        return found;
      if (opt.nothrow)
        return null;
      throw getNotFoundError(cmd);
    };
    module2.exports = which;
    which.sync = whichSync;
  }
});

// ../../common/temp/node_modules/.pnpm/pem@1.14.4/node_modules/pem/lib/openssl.js
var require_openssl = __commonJS({
  "../../common/temp/node_modules/.pnpm/pem@1.14.4/node_modules/pem/lib/openssl.js"(exports, module2) {
    var helper = require_helper();
    var cpspawn = require("child_process").spawn;
    var pathlib = require("path");
    var fs3 = require("fs");
    var osTmpdir = require_os_tmpdir();
    var crypto = require("crypto");
    var which = require_which();
    var settings = {};
    var tempDir = process.env.PEMJS_TMPDIR || osTmpdir();
    function set(option, value) {
      settings[option] = value;
    }
    function get(option) {
      return settings[option] || null;
    }
    function exec(params, searchStr, tmpfiles, callback) {
      if (!callback && typeof tmpfiles === "function") {
        callback = tmpfiles;
        tmpfiles = false;
      }
      spawnWrapper(params, tmpfiles, function(err, code, stdout, stderr) {
        var start, end;
        if (err) {
          return callback(err);
        }
        if (start = stdout.match(new RegExp("\\-+BEGIN " + searchStr + "\\-+$", "m"))) {
          start = start.index;
        } else {
          start = -1;
        }
        if (searchStr === "EC PARAMETERS") {
          searchStr = "EC PRIVATE KEY";
        }
        if (end = stdout.match(new RegExp("^\\-+END " + searchStr + "\\-+", "m"))) {
          end = end.index + end[0].length;
        } else {
          end = -1;
        }
        if (start >= 0 && end >= 0) {
          return callback(null, stdout.substring(start, end));
        } else {
          return callback(new Error(searchStr + " not found from openssl output:\n---stdout---\n" + stdout + "\n---stderr---\n" + stderr + "\ncode: " + code));
        }
      });
    }
    function execBinary(params, tmpfiles, callback) {
      if (!callback && typeof tmpfiles === "function") {
        callback = tmpfiles;
        tmpfiles = false;
      }
      spawnWrapper(params, tmpfiles, true, function(err, code, stdout, stderr) {
        if (err) {
          return callback(err);
        }
        return callback(null, stdout);
      });
    }
    function spawn(params, binary, callback) {
      var pathBin = get("pathOpenSSL") || process.env.OPENSSL_BIN || "openssl";
      testOpenSSLPath(pathBin, function(err) {
        if (err) {
          return callback(err);
        }
        var openssl = cpspawn(pathBin, params);
        var stderr = "";
        var stdout = binary ? Buffer.alloc(0) : "";
        openssl.stdout.on("data", function(data) {
          if (!binary) {
            stdout += data.toString("binary");
          } else {
            stdout = Buffer.concat([stdout, data]);
          }
        });
        openssl.stderr.on("data", function(data) {
          stderr += data.toString("binary");
        });
        var needed = 2;
        var code = -1;
        var finished = false;
        var done = function(err2) {
          if (finished) {
            return;
          }
          if (err2) {
            finished = true;
            return callback(err2);
          }
          if (--needed < 1) {
            finished = true;
            if (code) {
              if (code === 2 && (stderr === "" || /depth lookup: unable to/.test(stderr))) {
                return callback(null, code, stdout, stderr);
              }
              return callback(new Error("Invalid openssl exit code: " + code + "\n% openssl " + params.join(" ") + "\n" + stderr), code);
            } else {
              return callback(null, code, stdout, stderr);
            }
          }
        };
        openssl.on("error", done);
        openssl.on("exit", function(ret) {
          code = ret;
          done();
        });
        openssl.on("close", function() {
          stdout = binary ? stdout : Buffer.from(stdout, "binary").toString("utf-8");
          stderr = Buffer.from(stderr, "binary").toString("utf-8");
          done();
        });
      });
    }
    function spawnWrapper(params, tmpfiles, binary, callback) {
      if (!callback && typeof binary === "function") {
        callback = binary;
        binary = false;
      }
      var files = [];
      var delTempPWFiles = [];
      if (tmpfiles) {
        tmpfiles = [].concat(tmpfiles);
        var fpath, i;
        for (i = 0; i < params.length; i++) {
          if (params[i] === "--TMPFILE--") {
            fpath = pathlib.join(tempDir, crypto.randomBytes(20).toString("hex"));
            files.push({
              path: fpath,
              contents: tmpfiles.shift()
            });
            params[i] = fpath;
            delTempPWFiles.push(fpath);
          }
        }
      }
      var file;
      for (i = 0; i < files.length; i++) {
        file = files[i];
        fs3.writeFileSync(file.path, file.contents);
      }
      spawn(params, binary, function(err, code, stdout, stderr) {
        helper.deleteTempFiles(delTempPWFiles, function(fsErr) {
          callback(err || fsErr, code, stdout, stderr);
        });
      });
    }
    function testOpenSSLPath(pathBin, callback) {
      which(pathBin, function(error) {
        if (error) {
          return callback(new Error("Could not find openssl on your system on this path: " + pathBin));
        }
        callback();
      });
    }
    spawn(["version"], false, function(err, code, stdout, stderr) {
      var text = String(stdout) + "\n" + String(stderr) + "\n" + String(err);
      var tmp = text.match(/^LibreSSL/i);
      set("openSslVersion", (tmp && tmp[0] ? "LibreSSL" : "openssl").toUpperCase());
    });
    module2.exports = {
      exec,
      execBinary,
      spawn,
      spawnWrapper,
      set,
      get
    };
  }
});

// ../../common/temp/node_modules/.pnpm/pem@1.14.4/node_modules/pem/lib/convert.js
var require_convert = __commonJS({
  "../../common/temp/node_modules/.pnpm/pem@1.14.4/node_modules/pem/lib/convert.js"(exports, module2) {
    "use strict";
    var openssl = require_openssl();
    var helper = require_helper();
    module2.exports.PEM2DER = function(pathIN, pathOUT, type, callback) {
      if (!callback && typeof type === "function") {
        callback = type;
        type = "x509";
      }
      var params = [
        type,
        "-outform",
        "der",
        "-in",
        pathIN,
        "-out",
        pathOUT
      ];
      openssl.spawnWrapper(params, false, function(error, code) {
        if (error) {
          callback(error);
        } else {
          callback(null, code === 0);
        }
      });
    };
    module2.exports.DER2PEM = function(pathIN, pathOUT, type, callback) {
      if (!callback && typeof type === "function") {
        callback = type;
        type = "x509";
      }
      var params = [
        type,
        "-inform",
        "der",
        "-in",
        pathIN,
        "-out",
        pathOUT
      ];
      openssl.spawnWrapper(params, false, function(error, code) {
        if (error) {
          callback(error);
        } else {
          callback(null, code === 0);
        }
      });
    };
    module2.exports.PEM2P7B = function(pathBundleIN, pathOUT, callback) {
      var params = [
        "crl2pkcs7",
        "-nocrl",
        "-certfile",
        pathBundleIN.cert,
        "-out",
        pathOUT
      ];
      if (pathBundleIN.ca) {
        if (!Array.isArray(pathBundleIN.ca)) {
          pathBundleIN.ca = [pathBundleIN.ca];
        }
        pathBundleIN.ca.forEach(function(ca) {
          params.push("-certfile");
          params.push(ca);
        });
      }
      openssl.spawnWrapper(params, false, function(error, code) {
        if (error) {
          callback(error);
        } else {
          callback(null, code === 0);
        }
      });
    };
    module2.exports.P7B2PEM = function(pathIN, pathOUT, callback) {
      var params = [
        "pkcs7",
        "-print_certs",
        "-in",
        pathIN,
        "-out",
        pathOUT
      ];
      openssl.spawnWrapper(params, false, function(error, code) {
        if (error) {
          callback(error);
        } else {
          callback(null, code === 0);
        }
      });
    };
    module2.exports.PEM2PFX = function(pathBundleIN, pathOUT, password, callback) {
      var params = [
        "pkcs12",
        "-export",
        "-out",
        pathOUT,
        "-inkey",
        pathBundleIN.key,
        "-in",
        pathBundleIN.cert
      ];
      if (pathBundleIN.ca) {
        if (!Array.isArray(pathBundleIN.ca)) {
          pathBundleIN.ca = [pathBundleIN.ca];
        }
        pathBundleIN.ca.forEach(function(ca) {
          params.push("-certfile");
          params.push(ca);
        });
      }
      var delTempPWFiles = [];
      helper.createPasswordFile({ cipher: "", password, passType: "in" }, params, delTempPWFiles);
      helper.createPasswordFile({ cipher: "", password, passType: "out" }, params, delTempPWFiles);
      openssl.spawnWrapper(params, false, function(error, code) {
        function done(error2) {
          if (error2) {
            callback(error2);
          } else {
            callback(null, code === 0);
          }
        }
        helper.deleteTempFiles(delTempPWFiles, function(fsErr) {
          done(error || fsErr);
        });
      });
    };
    module2.exports.PFX2PEM = function(pathIN, pathOUT, password, callback) {
      var params = [
        "pkcs12",
        "-in",
        pathIN,
        "-out",
        pathOUT,
        "-nodes"
      ];
      var delTempPWFiles = [];
      helper.createPasswordFile({ cipher: "", password, passType: "in" }, params, delTempPWFiles);
      helper.createPasswordFile({ cipher: "", password, passType: "out" }, params, delTempPWFiles);
      openssl.spawnWrapper(params, false, function(error, code) {
        function done(error2) {
          if (error2) {
            callback(error2);
          } else {
            callback(null, code === 0);
          }
        }
        helper.deleteTempFiles(delTempPWFiles, function(fsErr) {
          done(error || fsErr);
        });
      });
    };
    module2.exports.P7B2PFX = function(pathBundleIN, pathOUT, password, callback) {
      var tmpfile = pathBundleIN.cert.replace(/\.[^.]+$/, ".cer");
      var params = [
        "pkcs7",
        "-print_certs",
        "-in",
        pathBundleIN.cert,
        "-out",
        tmpfile
      ];
      openssl.spawnWrapper(params, false, function(error, code) {
        if (error) {
          callback(error);
        } else {
          var params2 = [
            "pkcs12",
            "-export",
            "-in",
            tmpfile,
            "-inkey",
            pathBundleIN.key,
            "-out",
            pathOUT
          ];
          if (pathBundleIN.ca) {
            if (!Array.isArray(pathBundleIN.ca)) {
              pathBundleIN.ca = [pathBundleIN.ca];
            }
            pathBundleIN.ca.forEach(function(ca) {
              params2.push("-certfile");
              params2.push(ca);
            });
          }
          var delTempPWFiles = [tmpfile];
          helper.createPasswordFile({ cipher: "", password, passType: "in" }, params2, delTempPWFiles);
          helper.createPasswordFile({ cipher: "", password, passType: "out" }, params2, delTempPWFiles);
          openssl.spawnWrapper(params2, false, function(error2, code2) {
            function done(error3) {
              if (error3) {
                callback(error3);
              } else {
                callback(null, code2 === 0);
              }
            }
            helper.deleteTempFiles(delTempPWFiles, function(fsErr) {
              done(error2 || fsErr);
            });
          });
        }
      });
    };
  }
});

// ../../common/temp/node_modules/.pnpm/pem@1.14.4/node_modules/pem/lib/pem.js
var require_pem = __commonJS({
  "../../common/temp/node_modules/.pnpm/pem@1.14.4/node_modules/pem/lib/pem.js"(exports, module2) {
    "use strict";
    var { promisify } = require_promisify();
    var net = require("net");
    var helper = require_helper();
    var openssl = require_openssl();
    module2.exports.createPrivateKey = createPrivateKey;
    module2.exports.createDhparam = createDhparam;
    module2.exports.createEcparam = createEcparam;
    module2.exports.createCSR = createCSR;
    module2.exports.createCertificate = createCertificate;
    module2.exports.readCertificateInfo = readCertificateInfo;
    module2.exports.getPublicKey = getPublicKey;
    module2.exports.getFingerprint = getFingerprint;
    module2.exports.getModulus = getModulus;
    module2.exports.getDhparamInfo = getDhparamInfo;
    module2.exports.createPkcs12 = createPkcs12;
    module2.exports.readPkcs12 = readPkcs12;
    module2.exports.verifySigningChain = verifySigningChain;
    module2.exports.checkCertificate = checkCertificate;
    module2.exports.checkPkcs12 = checkPkcs12;
    module2.exports.config = config;
    module2.exports.convert = require_convert();
    var KEY_START = "-----BEGIN PRIVATE KEY-----";
    var KEY_END = "-----END PRIVATE KEY-----";
    var RSA_KEY_START = "-----BEGIN RSA PRIVATE KEY-----";
    var RSA_KEY_END = "-----END RSA PRIVATE KEY-----";
    var ENCRYPTED_KEY_START = "-----BEGIN ENCRYPTED PRIVATE KEY-----";
    var ENCRYPTED_KEY_END = "-----END ENCRYPTED PRIVATE KEY-----";
    var CERT_START = "-----BEGIN CERTIFICATE-----";
    var CERT_END = "-----END CERTIFICATE-----";
    function createPrivateKey(keyBitsize, options, callback) {
      if (!callback && !options && typeof keyBitsize === "function") {
        callback = keyBitsize;
        keyBitsize = void 0;
        options = {};
      } else if (!callback && keyBitsize && typeof options === "function") {
        callback = options;
        options = {};
      }
      keyBitsize = Number(keyBitsize) || 2048;
      var params = ["genrsa"];
      var delTempPWFiles = [];
      if (options && options.cipher && Number(helper.ciphers.indexOf(options.cipher)) !== -1 && options.password) {
        helper.createPasswordFile({ cipher: options.cipher, password: options.password, passType: "out" }, params, delTempPWFiles);
      }
      params.push(keyBitsize);
      openssl.exec(params, "RSA PRIVATE KEY", function(sslErr, key) {
        function done(err) {
          if (err) {
            return callback(err);
          }
          callback(null, {
            key
          });
        }
        helper.deleteTempFiles(delTempPWFiles, function(fsErr) {
          done(sslErr || fsErr);
        });
      });
    }
    function createDhparam(keyBitsize, callback) {
      if (!callback && typeof keyBitsize === "function") {
        callback = keyBitsize;
        keyBitsize = void 0;
      }
      keyBitsize = Number(keyBitsize) || 512;
      var params = [
        "dhparam",
        "-outform",
        "PEM",
        keyBitsize
      ];
      openssl.exec(params, "DH PARAMETERS", function(error, dhparam) {
        if (error) {
          return callback(error);
        }
        return callback(null, {
          dhparam
        });
      });
    }
    function createEcparam(keyName, paramEnc, noOut, callback) {
      if (!callback && typeof noOut === "undefined" && !paramEnc && typeof keyName === "function") {
        callback = keyName;
        keyName = void 0;
      } else if (!callback && typeof noOut === "undefined" && keyName && typeof paramEnc === "function") {
        callback = paramEnc;
        paramEnc = void 0;
      } else if (!callback && typeof noOut === "function" && keyName && paramEnc) {
        callback = noOut;
        noOut = void 0;
      }
      keyName = keyName || "secp256k1";
      paramEnc = paramEnc || "explicit";
      noOut = noOut || false;
      var params = [
        "ecparam",
        "-name",
        keyName,
        "-genkey",
        "-param_enc",
        paramEnc
      ];
      var searchString = "EC PARAMETERS";
      if (noOut) {
        params.push("-noout");
        searchString = "EC PRIVATE KEY";
      }
      openssl.exec(params, searchString, function(error, ecparam) {
        if (error) {
          return callback(error);
        }
        return callback(null, {
          ecparam
        });
      });
    }
    function createCSR(options, callback) {
      if (!callback && typeof options === "function") {
        callback = options;
        options = void 0;
      }
      options = options || {};
      if (options.commonName && (net.isIPv4(options.commonName) || net.isIPv6(options.commonName))) {
        if (!options.altNames) {
          options.altNames = [options.commonName];
        } else if (options.altNames.indexOf(options.commonName) === -1) {
          options.altNames = options.altNames.concat([options.commonName]);
        }
      }
      if (!options.clientKey) {
        createPrivateKey(options.keyBitsize || 2048, function(error, keyData) {
          if (error) {
            return callback(error);
          }
          options.clientKey = keyData.key;
          createCSR(options, callback);
        });
        return;
      }
      var params = [
        "req",
        "-new",
        "-" + (options.hash || "sha256")
      ];
      if (options.csrConfigFile) {
        params.push("-config");
        params.push(options.csrConfigFile);
      } else {
        params.push("-subj");
        params.push(generateCSRSubject(options));
      }
      params.push("-key");
      params.push("--TMPFILE--");
      var tmpfiles = [options.clientKey];
      var config2 = null;
      if (options.altNames && Array.isArray(options.altNames) && options.altNames.length) {
        params.push("-extensions");
        params.push("v3_req");
        params.push("-config");
        params.push("--TMPFILE--");
        var altNamesRep = [];
        for (var i = 0; i < options.altNames.length; i++) {
          altNamesRep.push((net.isIP(options.altNames[i]) ? "IP" : "DNS") + "." + (i + 1) + " = " + options.altNames[i]);
        }
        tmpfiles.push(config2 = [
          "[req]",
          "req_extensions = v3_req",
          "distinguished_name = req_distinguished_name",
          "[v3_req]",
          "subjectAltName = @alt_names",
          "[alt_names]",
          altNamesRep.join("\n"),
          "[req_distinguished_name]",
          "commonName = Common Name",
          "commonName_max = 64"
        ].join("\n"));
      } else if (options.config) {
        config2 = options.config;
      }
      var delTempPWFiles = [];
      if (options.clientKeyPassword) {
        helper.createPasswordFile({ cipher: "", password: options.clientKeyPassword, passType: "in" }, params, delTempPWFiles);
      }
      openssl.exec(params, "CERTIFICATE REQUEST", tmpfiles, function(sslErr, data) {
        function done(err) {
          if (err) {
            return callback(err);
          }
          callback(null, {
            csr: data,
            config: config2,
            clientKey: options.clientKey
          });
        }
        helper.deleteTempFiles(delTempPWFiles, function(fsErr) {
          done(sslErr || fsErr);
        });
      });
    }
    function createCertificate(options, callback) {
      if (!callback && typeof options === "function") {
        callback = options;
        options = void 0;
      }
      options = options || {};
      if (!options.csr) {
        createCSR(options, function(error, keyData) {
          if (error) {
            return callback(error);
          }
          options.csr = keyData.csr;
          options.config = keyData.config;
          options.clientKey = keyData.clientKey;
          createCertificate(options, callback);
        });
        return;
      }
      if (!options.clientKey) {
        options.clientKey = "";
      }
      if (!options.serviceKey) {
        if (options.selfSigned) {
          options.serviceKey = options.clientKey;
        } else {
          createPrivateKey(options.keyBitsize || 2048, function(error, keyData) {
            if (error) {
              return callback(error);
            }
            options.serviceKey = keyData.key;
            createCertificate(options, callback);
          });
          return;
        }
      }
      readCertificateInfo(options.csr, function(error2, data2) {
        if (error2) {
          return callback(error2);
        }
        var params = [
          "x509",
          "-req",
          "-" + (options.hash || "sha256"),
          "-days",
          Number(options.days) || "365",
          "-in",
          "--TMPFILE--"
        ];
        var tmpfiles = [options.csr];
        var delTempPWFiles = [];
        if (options.serviceCertificate) {
          params.push("-CA");
          params.push("--TMPFILE--");
          params.push("-CAkey");
          params.push("--TMPFILE--");
          if (options.serial) {
            params.push("-set_serial");
            if (helper.isNumber(options.serial)) {
              params.push("0x" + ("0000000000000000000000000000000000000000" + options.serial.toString(16)).slice(-40));
            } else {
              if (helper.isHex(options.serial)) {
                if (options.serial.startsWith("0x")) {
                  options.serial = options.serial.substring(2, options.serial.length);
                }
                params.push("0x" + ("0000000000000000000000000000000000000000" + options.serial).slice(-40));
              } else {
                params.push("0x" + ("0000000000000000000000000000000000000000" + helper.toHex(options.serial)).slice(-40));
              }
            }
          } else {
            params.push("-CAcreateserial");
            if (options.serialFile) {
              params.push("-CAserial");
              params.push(options.serialFile + ".srl");
            }
          }
          if (options.serviceKeyPassword) {
            helper.createPasswordFile({ cipher: "", password: options.serviceKeyPassword, passType: "in" }, params, delTempPWFiles);
          }
          tmpfiles.push(options.serviceCertificate);
          tmpfiles.push(options.serviceKey);
        } else {
          params.push("-signkey");
          params.push("--TMPFILE--");
          if (options.serviceKeyPassword) {
            helper.createPasswordFile({ cipher: "", password: options.serviceKeyPassword, passType: "in" }, params, delTempPWFiles);
          }
          tmpfiles.push(options.serviceKey);
        }
        if (options.config) {
          params.push("-extensions");
          params.push("v3_req");
          params.push("-extfile");
          params.push("--TMPFILE--");
          tmpfiles.push(options.config);
        } else if (options.extFile) {
          params.push("-extfile");
          params.push(options.extFile);
        } else {
          var altNamesRep = [];
          if (data2 && data2.san) {
            for (var i = 0; i < data2.san.dns.length; i++) {
              altNamesRep.push("DNS." + (i + 1) + " = " + data2.san.dns[i]);
            }
            for (var i2 = 0; i2 < data2.san.ip.length; i2++) {
              altNamesRep.push("IP." + (i2 + 1) + " = " + data2.san.ip[i2]);
            }
            for (var i3 = 0; i3 < data2.san.email.length; i3++) {
              altNamesRep.push("email." + (i3 + 1) + " = " + data2.san.email[i3]);
            }
            params.push("-extensions");
            params.push("v3_req");
            params.push("-extfile");
            params.push("--TMPFILE--");
            tmpfiles.push([
              "[v3_req]",
              "subjectAltName = @alt_names",
              "[alt_names]",
              altNamesRep.join("\n")
            ].join("\n"));
          }
        }
        if (options.clientKeyPassword) {
          helper.createPasswordFile({ cipher: "", password: options.clientKeyPassword, passType: "in" }, params, delTempPWFiles);
        }
        openssl.exec(params, "CERTIFICATE", tmpfiles, function(sslErr, data) {
          function done(err) {
            if (err) {
              return callback(err);
            }
            var response = {
              csr: options.csr,
              clientKey: options.clientKey,
              certificate: data,
              serviceKey: options.serviceKey
            };
            return callback(null, response);
          }
          helper.deleteTempFiles(delTempPWFiles, function(fsErr) {
            done(sslErr || fsErr);
          });
        });
      });
    }
    function getPublicKey(certificate, callback) {
      if (!callback && typeof certificate === "function") {
        callback = certificate;
        certificate = void 0;
      }
      certificate = (certificate || "").toString();
      var params;
      if (certificate.match(/BEGIN(\sNEW)? CERTIFICATE REQUEST/)) {
        params = [
          "req",
          "-in",
          "--TMPFILE--",
          "-pubkey",
          "-noout"
        ];
      } else if (certificate.match(/BEGIN RSA PRIVATE KEY/) || certificate.match(/BEGIN PRIVATE KEY/)) {
        params = [
          "rsa",
          "-in",
          "--TMPFILE--",
          "-pubout"
        ];
      } else {
        params = [
          "x509",
          "-in",
          "--TMPFILE--",
          "-pubkey",
          "-noout"
        ];
      }
      openssl.exec(params, "PUBLIC KEY", certificate, function(error, key) {
        if (error) {
          return callback(error);
        }
        return callback(null, {
          publicKey: key
        });
      });
    }
    function readCertificateInfo(certificate, callback) {
      if (!callback && typeof certificate === "function") {
        callback = certificate;
        certificate = void 0;
      }
      certificate = (certificate || "").toString();
      var isMatch = certificate.match(/BEGIN(\sNEW)? CERTIFICATE REQUEST/);
      var type = isMatch ? "req" : "x509";
      var params = [
        type,
        "-noout",
        "-nameopt",
        "RFC2253,sep_multiline,space_eq,-esc_msb,utf8",
        "-text",
        "-in",
        "--TMPFILE--"
      ];
      openssl.spawnWrapper(params, certificate, function(err, code, stdout, stderr) {
        if (err) {
          return callback(err);
        } else if (stderr) {
          return callback(stderr);
        }
        return fetchCertificateData(stdout, callback);
      });
    }
    function getModulus(certificate, password, hash, callback) {
      if (!callback && !hash && typeof password === "function") {
        callback = password;
        password = void 0;
        hash = false;
      } else if (!callback && hash && typeof hash === "function") {
        callback = hash;
        hash = false;
      }
      if (hash && hash !== "md5") {
        hash = false;
      }
      certificate = Buffer.isBuffer(certificate) && certificate.toString() || certificate;
      var type = "";
      if (certificate.match(/BEGIN(\sNEW)? CERTIFICATE REQUEST/)) {
        type = "req";
      } else if (certificate.match(/BEGIN RSA PRIVATE KEY/) || certificate.match(/BEGIN PRIVATE KEY/)) {
        type = "rsa";
      } else {
        type = "x509";
      }
      var params = [
        type,
        "-noout",
        "-modulus",
        "-in",
        "--TMPFILE--"
      ];
      var delTempPWFiles = [];
      if (password) {
        helper.createPasswordFile({ cipher: "", password, passType: "in" }, params, delTempPWFiles);
      }
      openssl.spawnWrapper(params, certificate, function(sslErr, code, stdout, stderr) {
        function done(err) {
          if (err) {
            return callback(err);
          }
          var match = stdout.match(/Modulus=([0-9a-fA-F]+)$/m);
          if (match) {
            return callback(null, {
              modulus: hash ? require(hash)(match[1]) : match[1]
            });
          } else {
            return callback(new Error("No modulus"));
          }
        }
        helper.deleteTempFiles(delTempPWFiles, function(fsErr) {
          done(sslErr || fsErr || stderr);
        });
      });
    }
    function getDhparamInfo(dh, callback) {
      dh = Buffer.isBuffer(dh) && dh.toString() || dh;
      var params = [
        "dhparam",
        "-text",
        "-in",
        "--TMPFILE--"
      ];
      openssl.spawnWrapper(params, dh, function(err, code, stdout, stderr) {
        if (err) {
          return callback(err);
        } else if (stderr) {
          return callback(stderr);
        }
        var result = {};
        var match = stdout.match(/Parameters: \((\d+) bit\)/);
        if (match) {
          result.size = Number(match[1]);
        }
        var prime = "";
        stdout.split("\n").forEach(function(line) {
          if (/\s+([0-9a-f][0-9a-f]:)+[0-9a-f]?[0-9a-f]?/g.test(line)) {
            prime += line.trim();
          }
        });
        if (prime) {
          result.prime = prime;
        }
        if (!match && !prime) {
          return callback(new Error("No DH info found"));
        }
        return callback(null, result);
      });
    }
    function config(options) {
      Object.keys(options).forEach(function(k) {
        openssl.set(k, options[k]);
      });
    }
    function getFingerprint(certificate, hash, callback) {
      if (!callback && typeof hash === "function") {
        callback = hash;
        hash = void 0;
      }
      hash = hash || "sha1";
      var params = [
        "x509",
        "-in",
        "--TMPFILE--",
        "-fingerprint",
        "-noout",
        "-" + hash
      ];
      openssl.spawnWrapper(params, certificate, function(err, code, stdout, stderr) {
        if (err) {
          return callback(err);
        } else if (stderr) {
          return callback(stderr);
        }
        var match = stdout.match(/Fingerprint=([0-9a-fA-F:]+)$/m);
        if (match) {
          return callback(null, {
            fingerprint: match[1]
          });
        } else {
          return callback(new Error("No fingerprint"));
        }
      });
    }
    function createPkcs12(key, certificate, password, options, callback) {
      if (!callback && typeof options === "function") {
        callback = options;
        options = {};
      }
      var params = ["pkcs12", "-export"];
      var delTempPWFiles = [];
      if (options.cipher && options.clientKeyPassword) {
        helper.createPasswordFile({ cipher: options.cipher, password: options.clientKeyPassword, passType: "in" }, params, delTempPWFiles);
      }
      helper.createPasswordFile({ cipher: "", password, passType: "word" }, params, delTempPWFiles);
      params.push("-in");
      params.push("--TMPFILE--");
      params.push("-inkey");
      params.push("--TMPFILE--");
      var tmpfiles = [certificate, key];
      if (options.certFiles) {
        tmpfiles.push(options.certFiles.join(""));
        params.push("-certfile");
        params.push("--TMPFILE--");
      }
      openssl.execBinary(params, tmpfiles, function(sslErr, pkcs12) {
        function done(err) {
          if (err) {
            return callback(err);
          }
          return callback(null, {
            pkcs12
          });
        }
        helper.deleteTempFiles(delTempPWFiles, function(fsErr) {
          done(sslErr || fsErr);
        });
      });
    }
    function readPkcs12(bufferOrPath, options, callback) {
      if (!callback && typeof options === "function") {
        callback = options;
        options = {};
      }
      options.p12Password = options.p12Password || "";
      var tmpfiles = [];
      var delTempPWFiles = [];
      var args = ["pkcs12", "-in", bufferOrPath];
      helper.createPasswordFile({ cipher: "", password: options.p12Password, passType: "in" }, args, delTempPWFiles);
      if (Buffer.isBuffer(bufferOrPath)) {
        tmpfiles = [bufferOrPath];
        args[2] = "--TMPFILE--";
      }
      if (options.clientKeyPassword) {
        helper.createPasswordFile({ cipher: "", password: options.clientKeyPassword, passType: "out" }, args, delTempPWFiles);
      } else {
        args.push("-nodes");
      }
      openssl.execBinary(args, tmpfiles, function(sslErr, stdout) {
        function done(err) {
          var keybundle = {};
          if (err && err.message.indexOf("No such file or directory") !== -1) {
            err.code = "ENOENT";
          }
          if (!err) {
            var certs = readFromString(stdout, CERT_START, CERT_END);
            keybundle.cert = certs.shift();
            keybundle.ca = certs;
            keybundle.key = readFromString(stdout, KEY_START, KEY_END).pop();
            if (keybundle.key) {
              return openssl.exec(["rsa", "-in", "--TMPFILE--"], "RSA PRIVATE KEY", [keybundle.key], function(err2, key) {
                keybundle.key = key;
                return callback(err2, keybundle);
              });
            }
            if (options.clientKeyPassword) {
              keybundle.key = readFromString(stdout, ENCRYPTED_KEY_START, ENCRYPTED_KEY_END).pop();
            } else {
              keybundle.key = readFromString(stdout, RSA_KEY_START, RSA_KEY_END).pop();
            }
          }
          return callback(err, keybundle);
        }
        helper.deleteTempFiles(delTempPWFiles, function(fsErr) {
          done(sslErr || fsErr);
        });
      });
    }
    function checkCertificate(certificate, passphrase, callback) {
      var params;
      var delTempPWFiles = [];
      if (!callback && typeof passphrase === "function") {
        callback = passphrase;
        passphrase = void 0;
      }
      certificate = (certificate || "").toString();
      if (certificate.match(/BEGIN(\sNEW)? CERTIFICATE REQUEST/)) {
        params = ["req", "-text", "-noout", "-verify", "-in", "--TMPFILE--"];
      } else if (certificate.match(/BEGIN RSA PRIVATE KEY/) || certificate.match(/BEGIN PRIVATE KEY/)) {
        params = ["rsa", "-noout", "-check", "-in", "--TMPFILE--"];
      } else {
        params = ["x509", "-text", "-noout", "-in", "--TMPFILE--"];
      }
      if (passphrase) {
        helper.createPasswordFile({ cipher: "", password: passphrase, passType: "in" }, params, delTempPWFiles);
      }
      openssl.spawnWrapper(params, certificate, function(sslErr, code, stdout, stderr) {
        function done(err) {
          if (err && err.toString().trim() !== "verify OK") {
            return callback(err);
          }
          var result;
          switch (params[0]) {
            case "rsa":
              result = /^Rsa key ok$/i.test(stdout.trim());
              break;
            default:
              result = /Signature Algorithm/im.test(stdout);
              break;
          }
          callback(null, result);
        }
        helper.deleteTempFiles(delTempPWFiles, function(fsErr) {
          done(sslErr || fsErr || stderr);
        });
      });
    }
    function checkPkcs12(bufferOrPath, passphrase, callback) {
      if (!callback && typeof passphrase === "function") {
        callback = passphrase;
        passphrase = "";
      }
      var tmpfiles = [];
      var delTempPWFiles = [];
      var args = ["pkcs12", "-info", "-in", bufferOrPath, "-noout", "-maciter", "-nodes"];
      helper.createPasswordFile({ cipher: "", password: passphrase, passType: "in" }, args, delTempPWFiles);
      if (Buffer.isBuffer(bufferOrPath)) {
        tmpfiles = [bufferOrPath];
        args[3] = "--TMPFILE--";
      }
      openssl.spawnWrapper(args, tmpfiles, function(sslErr, code, stdout, stderr) {
        function done(err) {
          if (err) {
            return callback(err);
          }
          callback(null, /MAC verified OK/im.test(stderr) || !/MAC verified OK/im.test(stderr) && !/Mac verify error/im.test(stderr));
        }
        helper.deleteTempFiles(delTempPWFiles, function(fsErr) {
          done(sslErr || fsErr);
        });
      });
    }
    function verifySigningChain(certificate, ca, callback) {
      if (!callback && typeof ca === "function") {
        callback = ca;
        ca = void 0;
      }
      if (!Array.isArray(certificate)) {
        certificate = [certificate];
      }
      if (!Array.isArray(ca) && ca !== void 0) {
        if (ca !== "") {
          ca = [ca];
        }
      }
      var files = [];
      if (ca !== void 0) {
        files.push(ca.join("\n"));
      }
      files.push(certificate.join("\n"));
      var params = ["verify"];
      if (ca !== void 0) {
        params.push("-CAfile");
        params.push("--TMPFILE--");
      }
      params.push("--TMPFILE--");
      openssl.spawnWrapper(params, files, function(err, code, stdout, stderr) {
        if (err) {
          return callback(err);
        }
        callback(null, stdout.trim().slice(-4) === ": OK");
      });
    }
    function fetchCertificateData(certData, callback) {
      try {
        certData = (certData || "").toString();
        var serial, subject, tmp, issuer;
        var certValues = {
          issuer: {}
        };
        var validity = {};
        var san;
        var ky, i;
        if ((serial = certData.match(/\s*Serial Number:\r?\n?\s*([^\r\n]*)\r?\n\s*\b/)) && serial.length > 1) {
          certValues.serial = serial[1];
        }
        if ((subject = certData.match(/\s*Subject:\r?\n(\s*(([a-zA-Z0-9.]+)\s=\s[^\r\n]+\r?\n))*\s*\b/)) && subject.length > 1) {
          subject = subject[0];
          tmp = matchAll(subject, /\s([a-zA-Z0-9.]+)\s=\s([^\r\n].*)/g);
          if (tmp) {
            for (i = 0; i < tmp.length; i++) {
              ky = tmp[i][1].trim();
              if (ky.match("(C|ST|L|O|OU|CN|emailAddress|DC)") || ky === "") {
                continue;
              }
              certValues[ky] = tmp[i][2].trim();
            }
          }
          tmp = subject.match(/\sC\s=\s([^\r\n].*?)[\r\n]/);
          certValues.country = tmp && tmp[1] || "";
          tmp = subject.match(/\sST\s=\s([^\r\n].*?)[\r\n]/);
          certValues.state = tmp && tmp[1] || "";
          tmp = subject.match(/\sL\s=\s([^\r\n].*?)[\r\n]/);
          certValues.locality = tmp && tmp[1] || "";
          tmp = matchAll(subject, /\sO\s=\s([^\r\n].*)/g);
          certValues.organization = tmp ? tmp.length > 1 ? tmp.sort(function(t, n) {
            var e = t[1].toUpperCase();
            var r = n[1].toUpperCase();
            return r > e ? -1 : e > r ? 1 : 0;
          }).sort(function(t, n) {
            return t[1].length - n[1].length;
          }).map(function(t) {
            return t[1];
          }) : tmp[0][1] : "";
          tmp = matchAll(subject, /\sOU\s=\s([^\r\n].*)/g);
          certValues.organizationUnit = tmp ? tmp.length > 1 ? tmp.sort(function(t, n) {
            var e = t[1].toUpperCase();
            var r = n[1].toUpperCase();
            return r > e ? -1 : e > r ? 1 : 0;
          }).sort(function(t, n) {
            return t[1].length - n[1].length;
          }).map(function(t) {
            return t[1];
          }) : tmp[0][1] : "";
          tmp = matchAll(subject, /\sCN\s=\s([^\r\n].*)/g);
          certValues.commonName = tmp ? tmp.length > 1 ? tmp.sort(function(t, n) {
            var e = t[1].toUpperCase();
            var r = n[1].toUpperCase();
            return r > e ? -1 : e > r ? 1 : 0;
          }).sort(function(t, n) {
            return t[1].length - n[1].length;
          }).map(function(t) {
            return t[1];
          }) : tmp[0][1] : "";
          tmp = matchAll(subject, /emailAddress\s=\s([^\r\n].*)/g);
          certValues.emailAddress = tmp ? tmp.length > 1 ? tmp.sort(function(t, n) {
            var e = t[1].toUpperCase();
            var r = n[1].toUpperCase();
            return r > e ? -1 : e > r ? 1 : 0;
          }).sort(function(t, n) {
            return t[1].length - n[1].length;
          }).map(function(t) {
            return t[1];
          }) : tmp[0][1] : "";
          tmp = matchAll(subject, /\sDC\s=\s([^\r\n].*)/g);
          certValues.dc = tmp ? tmp.length > 1 ? tmp.sort(function(t, n) {
            var e = t[1].toUpperCase();
            var r = n[1].toUpperCase();
            return r > e ? -1 : e > r ? 1 : 0;
          }).sort(function(t, n) {
            return t[1].length - n[1].length;
          }).map(function(t) {
            return t[1];
          }) : tmp[0][1] : "";
        }
        if ((issuer = certData.match(/\s*Issuer:\r?\n(\s*([a-zA-Z0-9.]+)\s=\s[^\r\n].*\r?\n)*\s*\b/)) && issuer.length > 1) {
          issuer = issuer[0];
          tmp = matchAll(issuer, /\s([a-zA-Z0-9.]+)\s=\s([^\r\n].*)/g);
          for (i = 0; i < tmp.length; i++) {
            ky = tmp[i][1].toString();
            if (ky.match("(C|ST|L|O|OU|CN|emailAddress|DC)")) {
              continue;
            }
            certValues.issuer[ky] = tmp[i][2].toString();
          }
          tmp = issuer.match(/\sC\s=\s([^\r\n].*?)[\r\n]/);
          certValues.issuer.country = tmp && tmp[1] || "";
          tmp = issuer.match(/\sST\s=\s([^\r\n].*?)[\r\n]/);
          certValues.issuer.state = tmp && tmp[1] || "";
          tmp = issuer.match(/\sL\s=\s([^\r\n].*?)[\r\n]/);
          certValues.issuer.locality = tmp && tmp[1] || "";
          tmp = matchAll(issuer, /\sO\s=\s([^\r\n].*)/g);
          certValues.issuer.organization = tmp ? tmp.length > 1 ? tmp.sort(function(t, n) {
            var e = t[1].toUpperCase();
            var r = n[1].toUpperCase();
            return r > e ? -1 : e > r ? 1 : 0;
          }).sort(function(t, n) {
            return t[1].length - n[1].length;
          }).map(function(t) {
            return t[1];
          }) : tmp[0][1] : "";
          tmp = matchAll(issuer, /\sOU\s=\s([^\r\n].*)/g);
          certValues.issuer.organizationUnit = tmp ? tmp.length > 1 ? tmp.sort(function(t, n) {
            var e = t[1].toUpperCase();
            var r = n[1].toUpperCase();
            return r > e ? -1 : e > r ? 1 : 0;
          }).sort(function(t, n) {
            return t[1].length - n[1].length;
          }).map(function(t) {
            return t[1];
          }) : tmp[0][1] : "";
          tmp = matchAll(issuer, /\sCN\s=\s([^\r\n].*)/g);
          certValues.issuer.commonName = tmp ? tmp.length > 1 ? tmp.sort(function(t, n) {
            var e = t[1].toUpperCase();
            var r = n[1].toUpperCase();
            return r > e ? -1 : e > r ? 1 : 0;
          }).sort(function(t, n) {
            return t[1].length - n[1].length;
          }).map(function(t) {
            return t[1];
          }) : tmp[0][1] : "";
          tmp = matchAll(issuer, /\sDC\s=\s([^\r\n].*)/g);
          certValues.issuer.dc = tmp ? tmp.length > 1 ? tmp.sort(function(t, n) {
            var e = t[1].toUpperCase();
            var r = n[1].toUpperCase();
            return r > e ? -1 : e > r ? 1 : 0;
          }).sort(function(t, n) {
            return t[1].length - n[1].length;
          }).map(function(t) {
            return t[1];
          }) : tmp[0][1] : "";
        }
        if ((san = certData.match(/X509v3 Subject Alternative Name: \r?\n([^\r\n]*)\r?\n/)) && san.length > 1) {
          san = san[1].trim() + "\n";
          certValues.san = {};
          tmp = pregMatchAll("DNS:([^,\\r\\n].*?)[,\\r\\n\\s]", san);
          certValues.san.dns = tmp || "";
          tmp = pregMatchAll("IP Address:([^,\\r\\n].*?)[,\\r\\n\\s]", san);
          certValues.san.ip = tmp || "";
          tmp = pregMatchAll("email:([^,\\r\\n].*?)[,\\r\\n\\s]", san);
          certValues.san.email = tmp || "";
        }
        if ((tmp = certData.match(/Not Before\s?:\s?([^\r\n]*)\r?\n/)) && tmp.length > 1) {
          validity.start = Date.parse(tmp && tmp[1] || "");
        }
        if ((tmp = certData.match(/Not After\s?:\s?([^\r\n]*)\r?\n/)) && tmp.length > 1) {
          validity.end = Date.parse(tmp && tmp[1] || "");
        }
        if (validity.start && validity.end) {
          certValues.validity = validity;
        }
        if ((tmp = certData.match(/Signature Algorithm: ([^\r\n]*)\r?\n/)) && tmp.length > 1) {
          certValues.signatureAlgorithm = tmp && tmp[1] || "";
        }
        if ((tmp = certData.match(/Public[ -]Key: ([^\r\n]*)\r?\n/)) && tmp.length > 1) {
          certValues.publicKeySize = (tmp && tmp[1] || "").replace(/[()]/g, "");
        }
        if ((tmp = certData.match(/Public Key Algorithm: ([^\r\n]*)\r?\n/)) && tmp.length > 1) {
          certValues.publicKeyAlgorithm = tmp && tmp[1] || "";
        }
        callback(null, certValues);
      } catch (err) {
        callback(err);
      }
    }
    function matchAll(str, regexp) {
      var matches = [];
      str.replace(regexp, function() {
        var arr = [].slice.call(arguments, 0);
        var extras = arr.splice(-2);
        arr.index = extras[0];
        arr.input = extras[1];
        matches.push(arr);
      });
      return matches.length ? matches : null;
    }
    function pregMatchAll(regex, haystack) {
      var globalRegex = new RegExp(regex, "g");
      var globalMatch = haystack.match(globalRegex) || [];
      var matchArray = [];
      var nonGlobalRegex, nonGlobalMatch;
      for (var i = 0; i < globalMatch.length; i++) {
        nonGlobalRegex = new RegExp(regex);
        nonGlobalMatch = globalMatch[i].match(nonGlobalRegex);
        matchArray.push(nonGlobalMatch[1]);
      }
      return matchArray;
    }
    function generateCSRSubject(options) {
      options = options || {};
      var csrData = {
        C: options.country || options.C,
        ST: options.state || options.ST,
        L: options.locality || options.L,
        O: options.organization || options.O,
        OU: options.organizationUnit || options.OU,
        CN: options.commonName || options.CN || "localhost",
        DC: options.dc || options.DC || "",
        emailAddress: options.emailAddress
      };
      var csrBuilder = Object.keys(csrData).map(function(key) {
        if (csrData[key]) {
          if (typeof csrData[key] === "object" && csrData[key].length >= 1) {
            var tmpStr = "";
            csrData[key].map(function(o) {
              tmpStr += "/" + key + "=" + o.replace(/[^\w .*\-,@']+/g, " ").trim();
            });
            return tmpStr;
          } else {
            return "/" + key + "=" + csrData[key].replace(/[^\w .*\-,@']+/g, " ").trim();
          }
        }
      });
      return csrBuilder.join("");
    }
    function readFromString(string, start, end) {
      if (Buffer.isBuffer(string)) {
        string = string.toString("utf8");
      }
      var output = [];
      if (!string) {
        return output;
      }
      var offset = string.indexOf(start);
      while (offset !== -1) {
        string = string.substring(offset);
        var endOffset = string.indexOf(end);
        if (endOffset === -1) {
          break;
        }
        endOffset += end.length;
        output.push(string.substring(0, endOffset));
        offset = string.indexOf(start, endOffset);
      }
      return output;
    }
    module2.exports.promisified = {
      createPrivateKey: promisify(createPrivateKey),
      createDhparam: promisify(createDhparam),
      createEcparam: promisify(createEcparam),
      createCSR: promisify(createCSR),
      createCertificate: promisify(createCertificate),
      readCertificateInfo: promisify(readCertificateInfo),
      getPublicKey: promisify(getPublicKey),
      getFingerprint: promisify(getFingerprint),
      getModulus: promisify(getModulus),
      getDhparamInfo: promisify(getDhparamInfo),
      createPkcs12: promisify(createPkcs12),
      readPkcs12: promisify(readPkcs12),
      verifySigningChain: promisify(verifySigningChain),
      checkCertificate: promisify(checkCertificate),
      checkPkcs12: promisify(checkPkcs12)
    };
  }
});

// index.mjs
__export(exports, {
  default: () => utils_default,
  envproto: () => envproto_exports,
  esproto: () => esproto_exports,
  fsproto: () => fsproto_exports
});

// envproto/index.mjs
var envproto_exports = {};
__export(envproto_exports, {
  buildEnv: () => buildEnv,
  getDevCert: () => getDevCert,
  syncConfig: () => syncConfig,
  syncEnv: () => syncEnv,
  syncEnvAndConfig: () => syncEnvAndConfig
});

// envproto/envvars.mjs
var import_dotenv = __toModule(require_main());
var { parsed } = import_dotenv.default.config();
var wrapValue = (v) => `"${v}"`;
process.argv.slice(2).forEach((argv) => {
  if (!argv.includes("="))
    return;
  const [arg, v] = argv.split("=");
  parsed[arg] = v;
});
var buildEnv = (env = parsed) => Object.entries(env).reduce((a, [
  k,
  v
]) => {
  a[`process.env.${k}`] = wrapValue(env[k]);
  process.env[k] = env[k];
  return a;
}, {});
var syncEnv = (_a = {}) => {
  var _b = _a, { config = {} } = _b, opts = __objRest(_b, ["config"]);
  for (const k in config) {
    if (config.hasOwnProperty(k) && parsed[k]?.length === 0) {
      if (process?.env)
        process.env[k] = config[k];
      parsed[k] = config[k];
    }
  }
  return { parsed, processEnv: buildEnv() };
};
var syncConfig = (_a = {}) => {
  var _b = _a, { config = {} } = _b, opts = __objRest(_b, ["config"]);
  return __spreadProps(__spreadValues({}, opts), {
    config: __spreadValues(__spreadValues({}, config), parsed)
  });
};
var syncEnvAndConfig = (_a) => {
  var _b = _a, { config = {} } = _b, opts = __objRest(_b, ["config"]);
  return __spreadValues(__spreadValues({}, syncEnv({ config })), syncConfig(__spreadValues({ config }, opts)));
};

// fsproto/index.mjs
var fsproto_exports = {};
__export(fsproto_exports, {
  isMain: () => isMain,
  parentUri: () => parentUri,
  readFile: () => readFile,
  readFiles: () => readFiles,
  resolve: () => resolve,
  writeFile: () => writeFile,
  writeFiles: () => writeFiles
});
var import_url2 = __toModule(require("url"));

// ../../common/temp/node_modules/.pnpm/es-main@1.0.2/node_modules/es-main/main.js
var import_url = __toModule(require("url"));
var import_process = __toModule(require("process"));
var import_path = __toModule(require("path"));
function stripExt(name2) {
  const extension = import_path.default.extname(name2);
  if (!extension) {
    return name2;
  }
  return name2.slice(0, -extension.length);
}
function main_default(meta) {
  const modulePath = (0, import_url.fileURLToPath)(meta.url);
  const scriptPath = import_process.default.argv[1];
  const extension = import_path.default.extname(scriptPath);
  if (extension) {
    return modulePath === scriptPath;
  }
  return stripExt(modulePath) === scriptPath;
}

// fsproto/index.mjs
var import_fs = __toModule(require("fs"));
var import_mkdirp = __toModule(require_mkdirp());
var import_path2 = __toModule(require("path"));
var import_meta = {};
var isMain = (requireMain, importMeta) => {
  if (typeof require !== "undefined") {
    return requireMain == module;
  }
  if (!typeof importMeta)
    throw "must pass in import.meta";
  return main_default(importMeta);
};
var { readFile } = import_fs.default.promises;
var readFiles = async (files = []) => !files.length ? [] : Promise.all(files.map(({ filename, encoding = "utf8" }) => readFile(filename, encoding)));
var writeFile = async (...opts) => {
  try {
    await (0, import_mkdirp.default)(import_path2.default.dirname(opts[0]));
  } catch (e) {
  } finally {
    return import_fs.default.promises.writeFile.apply(import_fs.default, opts);
  }
};
var writeFiles = async (files = []) => !files.length ? [] : Promise.all(files.map((_a) => {
  var _b = _a, { filename, data, encoding = "utf8" } = _b, opts = __objRest(_b, ["filename", "data", "encoding"]);
  return writeFile(filename, data, __spreadValues({ encoding }, opts));
})).catch((e) => [e]);
var parentUri = (importMeta = import_meta) => importMeta?.url ? (0, import_url2.fileURLToPath)(importMeta.url) : module.filename;
var resolve = async (fileToImport, parent = parentUri()) => import_meta?.resolve ? await import_meta.resolve(fileToImport, parent) : import_path2.default.join(import_path2.default.dirname(parent), fileToImport);

// envproto/ssl.mjs
var import_path3 = __toModule(require("path"));
var import_pem = __toModule(require_pem());
var import_meta2 = {};
var getDevCert = async (_a = {}) => {
  var _b = _a, {
    selfSigned = true,
    days = 7,
    domain = process.env.DEV_DOMAIN || "localhost",
    tmpDir = process.env.PEMJS_TMPDIR,
    commonName = `*.${domain}`
  } = _b, opts = __objRest(_b, [
    "selfSigned",
    "days",
    "domain",
    "tmpDir",
    "commonName"
  ]);
  if (!tmpDir)
    process.env.PEMJS_TMPDIR = `${import_path3.default.dirname(parentUri(import_meta2))}/certs`;
  let certificate;
  let clientKey;
  let csr;
  let serviceKey;
  const msgs = [];
  const names = {
    certificate: `${process.env.PEMJS_TMPDIR}/${domain}.certificate`,
    clientKey: `${process.env.PEMJS_TMPDIR}/${domain}.clientKey`,
    csr: `${process.env.PEMJS_TMPDIR}/${domain}.csr`,
    serviceKey: `${process.env.PEMJS_TMPDIR}/${domain}.serviceKey`
  };
  try {
    [
      certificate,
      clientKey,
      csr,
      serviceKey
    ] = await readFiles([
      { filename: names.certificate },
      { filename: names.clientKey },
      { filename: names.csr },
      { filename: names.serviceKey }
    ]);
    if (!certificate || !serviceKey || !csr || !clientKey)
      throw "couldnt read dev keys";
    const certValid = await import_pem.default.promisified.checkCertificate(certificate);
    if (!certValid)
      throw "need to create new dev cert";
    return {
      certificate,
      clientKey,
      csr,
      serviceKey
    };
  } catch (e) {
    msgs.push(e.message);
  }
  try {
    ({
      certificate,
      clientKey,
      csr,
      serviceKey
    } = await import_pem.default.promisified.createCertificate({
      selfSigned,
      days,
      commonName
    }));
    if (certificate instanceof Error) {
      console.info("\n\n could not create certs", certificate);
      return {};
    } else if (!certificate || !serviceKey || !csr || !clientKey)
      throw "@noahedwardhall needs to fix @nodeproto/lib/envproto";
    return writeFiles([
      { filename: names.certificate, data: certificate },
      { filename: names.clientKey, data: clientKey },
      { filename: names.csr, data: csr },
      { filename: names.serviceKey, data: serviceKey }
    ]).then(() => ({ certificate, clientKey, csr, serviceKey }));
  } catch (e) {
    console.error("\n\n could not retrieve, create, or save new|old dev certs", msgs.concat(e.message), e);
  }
};

// esproto/index.mjs
var esproto_exports = {};
__export(esproto_exports, {
  cache: () => cache,
  fileCopy: () => fileCopy,
  fileShouldCopy: () => fileShouldCopy,
  filesToCopy: () => filesToCopy,
  popCopy: () => popCopy
});

// esproto/plugins/popCopy.mjs
var import_fs2 = __toModule(require("fs"));
var import_path4 = __toModule(require("path"));
var cache = new Map();
var fileShouldCopy = async (sourcepath) => {
  let fd;
  try {
    fd = await import_fs2.default.promises.open(sourcepath, "r");
    if (!fd)
      return;
    const { mtimeMs } = await fd.stat();
    const cacheMs = cache.get(sourcepath)?.ms;
    fd.close();
    return (!cacheMs || cacheMs < mtimeMs) && mtimeMs;
  } catch (e) {
    console.warn("error accessing file, removing from cache\n", { sourcepath, e });
    fd?.close();
    cache.delete(sourcepath);
    return false;
  }
};
var fileCopy = async (newCacheMs, sourcepath, outdir) => {
  try {
    if (newCacheMs) {
      const outpath = `${outdir}/${import_path4.default.basename(sourcepath)}`;
      cache.set(sourcepath, { ms: newCacheMs, outpath });
      await import_fs2.default.promises.mkdir(outdir, { recursive: true });
      await import_fs2.default.promises.copyFile(sourcepath, outpath);
    }
  } catch (e) {
    cache.delete(sourcepath);
    console.warn("\n\n error copying file into outdir", { sourcepath, e });
  }
};
var filesToCopy = (options) => {
  const msg = "not copying files:";
  if (!options.length) {
    return console.warn(`${msg} options empty`, options);
  }
  options.forEach(async (_a) => {
    var _b = _a, { outdir, endingWith, indir, recurse } = _b, opts = __objRest(_b, ["outdir", "endingWith", "indir", "recurse"]);
    try {
      if (!(endingWith instanceof RegExp) || (!indir || !indir.startsWith("/")) || (!outdir || !outdir.startsWith("/"))) {
        return console.warn(`${msg} invalid params`, { outdir, endingWith, indir, recurse, opts });
      }
      const sourcedirs = await import_fs2.default.promises.readdir(indir, { encoding: "utf8", withFileTypes: true }) ?? [];
      sourcedirs.forEach((dirEnt) => {
        if (!dirEnt.name.includes(".") && recurse) {
          filesToCopy([
            __spreadValues({
              outdir,
              endingWith,
              recurse,
              indir: `${indir}/${dirEnt.name}`
            }, opts)
          ]);
        } else {
          if (endingWith.test(dirEnt.name)) {
            const sourcepath = `${indir}/${dirEnt.name}`;
            const outpath = `${outdir}/${dirEnt.name}`;
            cache.set(sourcepath, { ms: null, outpath });
          }
        }
      });
    } catch (e) {
      console.error("\n\n error in popcopy", e);
    }
  });
};
var name = "popCopyPlugin";
function popCopy(config) {
  popCopy.options = config;
  popCopy.onStarted = false;
  return {
    name,
    setup(build) {
      const { options } = popCopy.options ?? {};
      if (!options)
        return;
      filesToCopy(options);
      build.onResolve({ filter: /^popcopy$/ }, () => ({}));
      build.onStart(async () => {
        if (popCopy.onStarted)
          return;
        popCopy.onStarted = true;
        if (cache.size) {
          for (const [
            sourcepath,
            { ms, outpath }
          ] of cache) {
            try {
              const newCacheMs = await fileShouldCopy(sourcepath);
              if (newCacheMs) {
                await fileCopy(newCacheMs, sourcepath, import_path4.default.dirname(outpath));
              }
            } catch (e) {
              console.warn("popCopy.onStart error", e);
            }
          }
        }
      });
      build.onEnd((result) => {
        popCopy.onStarted = false;
      });
    }
  };
}

// index.mjs
var utils_default = { envproto: envproto_exports, esproto: esproto_exports, fsproto: fsproto_exports };
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  envproto,
  esproto,
  fsproto
});
//# sourceMappingURL=index.cjs.map

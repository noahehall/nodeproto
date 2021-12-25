// @FlowTODO

import { suite as internalSuite } from "uvu";

// import http from "http"; @see https://github.com/nodejs/node/issues/41320
import chaiAsPromised from "chai-as-promised";
import chaiExclude from "chai-exclude";
import chaiNock from "chai-nock";
import internalChai from "chai";
import internalNock from "nock";
import internalSinon from "sinon";

internalChai.config.includeStack = true;
internalChai.config.showDiff = true;
internalChai.config.truncateThreshold = 0; // show everything

internalSinon.assert.expose(internalChai.assert, { prefix: "" }); // @see https://github.com/domenic/sinon-chai
internalChai.use(chaiNock); // https://github.com/chrisandrews7/chai-nock#readme
internalChai.use(chaiExclude); // https://github.com/mesaugat/chai-exclude#examples
internalChai.use(chaiAsPromised); // https://github.com/domenic/chai-as-promised#assert-interface

// export const get = http.get;
// export const request = http.request;
export const assert = internalChai.assert; // https://www.chaijs.com/api/assert/
export const nock = internalNock;
export const sinon = internalSinon;
export const suite = internalSuite;

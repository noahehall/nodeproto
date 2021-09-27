// import * as internalAssert from 'uvu/assert';
import { suite as internalSuite } from 'uvu';

import chaiAsPromised from 'chai-as-promised';
import chaiExclude from 'chai-exclude';
import chaiNock from 'chai-nock';
import http from 'http';
import internalChai from 'chai';

import internalNock from 'nock';
import internalSinon from 'sinon';

internalChai.config.includeStack = true;
internalChai.config.showDiff = true;
internalChai.truncateThreshold = 0; // show everything

internalSinon.assert.expose(internalChai.assert, { prefix: '' }); // @see https://github.com/domenic/sinon-chai
internalChai.use(chaiNock); // https://github.com/chrisandrews7/chai-nock#readme
internalChai.use(chaiExclude); // https://github.com/mesaugat/chai-exclude#examples
internalChai.use(chaiAsPromised); // https://github.com/domenic/chai-as-promised#assert-interface


export const assert = internalChai.assert; // https://www.chaijs.com/api/assert/
export const get = http.get;
export const nock = internalNock;
export const post = http.post;
export const sinon = internalSinon;
export const suite = internalSuite;

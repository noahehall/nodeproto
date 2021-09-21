import * as assert from 'uvu/assert';
import { suite } from 'uvu';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiExclude from 'chai-exclude';
import chaiNock from 'chai-nock';
import http from 'http';
import nock from 'nock';
import sinon from 'sinon';

chai.config.includeStack = true;
chai.config.showDiff = true;
chai.truncateThreshold = 0; // show everything

sinon.assert.expose(chai.assert, { prefix: ''}); // @see https://github.com/domenic/sinon-chai
chai.use(chaiNock); // https://github.com/chrisandrews7/chai-nock#readme
chai.use(chaiExclude); // https://github.com/mesaugat/chai-exclude#examples
chai.use(chaiAsPromised); // https://github.com/domenic/chai-as-promised#assert-interface

export default {
  assert: chai.assert, // https://www.chaijs.com/api/assert/
  get: http.get,
  nock,
  post: http.post,
  sinon,
  suite,
}

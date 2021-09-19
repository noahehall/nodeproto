import * as assert from 'uvu/assert';
import { suite } from 'uvu';

import chai from 'chai';
import chaiExclude from 'chai-exclude';
import chaiNock from 'chai-nock';
import http from 'http';
import nock from 'nock';
import sinon from 'sinon';

chai.config.includeStack = true;
chai.config.showDiff = true;
chai.truncateThreshold = 0; // show everything

// // @see https://github.com/domenic/sinon-chai
sinon.assert.expose(chai.assert, { prefix: ''});
chai.use(chaiNock);
chai.use(chaiExclude);

export default {
  assert: chai.assert, // https://www.chaijs.com/api/assert/
  get: http.get,
  nock,
  post: http.post,
  sinon,
  suite,
}

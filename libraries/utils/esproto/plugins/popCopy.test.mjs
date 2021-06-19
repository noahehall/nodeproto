
import { fsproto } from '@nodeproto/utils';
import { test } from 'purple-tape';
import fs from 'fs';
import * as popCopy from './popCopy.mjs';
import path from 'path';
import sinon from 'sinon';
import rimraf from 'rimraf'

const fstubs = {};
test.beforeAll(async t => {
  // setup reusable stubs
  fstubs.fd = Promise.resolve({ close: sinon.stub() });
  fstubs.negativeInfinity = Promise.resolve({ mtimeMs: Number.NEGATIVE_INFINITY })
  fstubs.postitiveInfinity = Promise.resolve({ mtimeMs: Number.POSITIVE_INFINITY })
  fstubs.sourcepath = await fsproto.resolve(
    './fixtures/sourcedir/copytooutdir.mjs',
    import.meta.url
  );
})

// restart test state
test.afterEach(t => t.pass(sinon.restore()))

test(
  'fileShouldCopy: returns latest timestamp for updated sourcepath',
  async t => {
  // stubs for this test case
    fstubs.open = sinon.stub(
      fs.promises,
      'open'
    ).returns(fstubs.fd)
    fstubs.stat = sinon.stub(
      fs.promises,
      'stat'
    ).returns(fstubs.postitiveInfinity)

    // run the unit under test
    const newmtimems = await popCopy.fileShouldCopy(fstubs.sourcepath)

    // confirm
    t.equal(
      newmtimems,
      Number.POSITIVE_INFINITY,
      'yes'
    )
  }
)

test(
  'fileShouldCopy: returns falsey if sourcepath hasnt been updated',
  async t => {
  // stub for this test case
    fstubs.open = sinon.stub(
      fs.promises,
      'open'
    ).returns(fstubs.fd)
    fstubs.stat = sinon.stub(
      fs.promises,
      'stat'
    ).returns(fstubs.negativeInfinity)

    // run the unit under test
    popCopy.cache.set(
      fstubs.sourcepath,
      { ms: Number.POSITIVE_INFINITY, }
    )
    const newmtimems = await popCopy.fileShouldCopy(fstubs.sourcepath)

    // confirm logic
    t.equal(
      newmtimems,
      false,
      'yes'
    )
  }
);

test(
  'fileShouldCopy: closes filehandle and delets sourcepath on error',
  async t => {
  // stub for this test case
    fstubs.open = sinon.stub(
      fs.promises,
      'open'
    ).throws()
    fstubs.stat = sinon.stub(
      fs.promises,
      'stat'
    ).returns(fstubs.negativeInfinity)

    // run the unit under test
    popCopy.cache.set(
      fstubs.sourcepath,
      { ms: Number.POSITIVE_INFINITY, }
    )
    const newmtimems = await popCopy.fileShouldCopy(fstubs.sourcepath)

    t

    // confirm logic
      .t.throws(
        newmtimems,
        false,
        'yes'
      )
  }
)

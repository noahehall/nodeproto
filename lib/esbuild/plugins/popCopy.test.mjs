'use strict';

import test from 'tape';
import * as popCopy from './popCopy.mjs';
import path from 'path';
import sinon from 'sinon';
import fs from 'fs';

const resolve = (parent, specifier) => path.join(path.dirname(parent), specifier).replace('file:', '');
const sourcepath = resolve(import.meta.url, './popCopy.mjs');


test('fileshouldCopy: returns mtimeMs from node.fs if we should copy file', t => {
  const mtimeMs = 'hello';
  sinon.stub(fs, 'statSync').returns({mtimeMs: 'hello'});

  t.equal(mtimeMs, popCopy.fileShouldCopy(sourcepath));
  t.end() // not really necessary
});

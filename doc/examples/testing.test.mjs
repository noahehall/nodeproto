'use strict';

import test from 'tape';

function delay (time) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve()
    }, time)
  })
}

test('run async test', async t => {
  await delay(5000)
  t.true(true)
  t.end() // not really necessary
});

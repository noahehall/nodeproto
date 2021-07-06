import { test } from 'purple-tape';
import * as wrapper from '@nodeproto/utils';
import defaultImport, { envproto, esproto, fsproto } from '@nodeproto/utils';

test(
  'esm: can glob import',
  t => {
    t.deepLooseEqual(
      Object.keys(wrapper),
      [
        'default',
        'envproto',
        'esproto',
        'fsproto'
      ]
    );
  }
);

test(
  'esm: default import',
  t => {
    t.deepLooseEqual(
      Object.keys(defaultImport),
      [
        'envproto',
        'esproto',
        'fsproto'
      ]
    );
  }
);

test(
  'ESM: can destructure import',
  t => {
    t.deepLooseEqual(
      Object.keys({ ...envproto, ...esproto, ...fsproto }),
      Object.keys({ ...wrapper.envproto, ...wrapper.esproto, ...wrapper.fsproto })
    )
  }
);

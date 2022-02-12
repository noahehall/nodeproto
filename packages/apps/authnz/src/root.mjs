// @flow

import { dirs, isMain } from '@nodeproto/wtf';
import { getDevCert } from '@nodeproto/envproto';
import { throwIt } from '@nodeproto/shared';

import https from 'https';

import { App } from './app';

import type { ServerType } from './libdefs';

export const runApp = async (): ServerType => {
  const { clientKey, certificate } = (await getDevCert({ outdir: './' })) || {};

  if (!clientKey || !certificate) throwIt('HTTPS is required, but could not find certificates');

  const port = Number(process.env.PORT || 3443);

  return https
    .createServer({ key: clientKey, cert: certificate }, (await App).callback())
    .listen({ host: '0.0.0.0', port }, () =>
      console.info('\n\n server running on: ', port)
  );
};

// todo: use stuff from @nodeproto/shared
// if (require.main === module)
//   runApp().catch((e) => {
//     console.info('\n\n got err in pkgcheck', e);
//   });

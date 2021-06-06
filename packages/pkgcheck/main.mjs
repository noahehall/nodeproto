'use strict';

import { fsproto, envproto } from '@nodeproto/lib';
import App from './app/app.mjs';
import http from 'http';
import https from 'https';

const port = process.env.PKGCHECK_HTTP_PORT;
const sport = process.env.PKGCHECK_HTTPS_PORT;

export const runApp = async () => {
  if (!port && !sport) throw 'PKGCHECK_HTTP_PORT or PKGHECK_HTTPS_PORT must be set in env';

  if (port)
    http.createServer((await App).callback()).listen(
      port,
      () => console.info('\n\n app running on: ', port)
    );

  if (sport) {
    const { clientKey: key, certificate: cert } = await envproto.getDevCert();

    if (!key || !cert) console.error('\n\n did not receive dev certs', typeof key, typeof cert);
    else https.createServer(
      { key, cert },
      (await App).callback()).listen(
        sport,
        () => console.info('\n\n app running on: ', sport)
    );

  }
}


if (fsproto.isMain(typeof require !== 'undefined' && require.main, import.meta)) runApp();



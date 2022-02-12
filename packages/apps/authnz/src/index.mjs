// @flow

import { dirs, isMain } from '@nodeproto/wtf';
import { getDevCert } from '@nodeproto/envproto';
import http from 'http';
import https from 'https';

import { App } from './app';


const port = process.env.PKGCHECK_HTTP_PORT || 3000;
const sport = process.env.PKGCHECK_HTTPS_PORT || 3443;

export const runApp = async (): Promise<Servers[]> => {
  if (!port && !sport)
    throw new Error('PKGCHECK_HTTP_PORT or PKGHECK_HTTPS_PORT must be set in env');

  const servers = [];
  if (port)
    servers.push(
      http
        .createServer((await App).callback())
        .listen({ host: '0.0.0.0', port }, () => console.info('\n\n server running on: ', port))
    );

  if (sport) {
    const { clientKey: key, certificate: cert } = await getDevCert({ outdir: './' });

    if (!key || !cert) console.error('\n\n did not receive dev certs', typeof key, typeof cert);
    else
      servers.push(
        https
          .createServer({ key, cert }, (await App).callback())
          .listen({ host: '0.0.0.0', port: sport }, () =>
            console.info('\n\n server running on: ', sport)
          )
      );
  }

  return servers;
};

// todo: use stuff from @nodeproto/shared
// if (require.main === module)
//   runApp().catch((e) => {
//     console.info('\n\n got err in pkgcheck', e);
//   });

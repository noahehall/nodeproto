// @flow

import { dirs, isMain } from '@nodeproto/wtf';
import { logIt, throwIt } from '@nodeproto/shared'; // TODO: logIt not working in esbuild
import { getDevCert } from '@nodeproto/envproto';
import http from 'http';
import https from 'https';

import { createApp } from './app';

import type { AppType, KoaAppType, ServerType } from './libdefs';

// shouldnt be used if SSL termated at reverse proxy
export const runSecureServer = async ({
  app,
  host = '0.0.0.0',
  port = 8043,
}: {
  app: KoaAppType,
  host?: string,
  port?: string | number
}): ServerType => {
  const { clientKey: key, certificate: cert } = (await getDevCert({ outdir: './' })) || {};

  if (!key || !cert) throwIt('HTTPS is required, but could not find certificates');

  return (await import('https')).createServer({ key, cert }, app.callback())
    .listen(
      { host, port: Number(port) },
      () => { console.info('\n\n secure server running on: ', port) }
    );
};

// should be used if SSL termated at reverse proxy
export const runInsecureServer = async ({
  app,
  host = '0.0.0.0',
  port = 8080,
}: {
  app: KoaAppType,
  host?: string,
  port?: string | number
}): ServerType => {
  return (await import('http'))
    .createServer(app.callback())
    .listen({ host, port: Number(port) },
      () => console.info('\n\n insecure server running on: ', port)
    );
};

export const runApp = async ({
ssl = process.env.USE_SSL || true
}: { ssl?: string | boolean } = {}): ServerType => {
  const app = await createApp();

  return !ssl ? runSecureServer({ app }) : runInsecureServer({ app });
};

runApp();
// todo: use stuff from @nodeproto/shared
// if (require.main === module)
//   runApp().catch((e) => {
//     console.info('\n\n got err in pkgcheck', e);
//   });

import { isMain, dirs } from '@nodeproto/wtf';
import { getDevCert } from '@nodeproto/envproto';

import App from './app.mjs';
import http from 'http';
import https from 'https';

const port = process.env.PKGCHECK_HTTP_PORT || 8080;
const sport = process.env.PKGCHECK_HTTPS_PORT || 8443;

export const runApp = async () => {
  if (!port && !sport) throw 'PKGCHECK_HTTP_PORT or PKGHECK_HTTPS_PORT must be set in env';

  const servers = [];
  if (port)
    servers.push(http.createServer((await App).callback()).listen(
      port,
      () => console.info('\n\n server running on: ', port)
    ));

  if (sport) {
    const { clientKey: key, certificate: cert } = await getDevCert();

    if (!key || !cert) console.error('\n\n did not receive dev certs', typeof key, typeof cert);
    else servers.push(https.createServer(
      { key, cert },
      (await App).callback()).listen(
        sport,
        () => console.info('\n\n server running on: ', sport)
    ));
  }

  return servers;
}

const getRequireOrImportMeta = () => dirs.isEsm() ? import.meta: require.main;

if (isMain(getRequireOrImportMeta())) runApp().catch(e => {
  console.info('\n\n got err in pkgcheck', e);
});

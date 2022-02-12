// @flow

import { getPkgJson, logIt, throwIt } from '@nodeproto/shared';
import { getFsproto } from '@nodeproto/wtf';
import pem from 'pem';

export const getDevCert = async ({
  days = 7,
  domain = 'localhost',
  outdir = '',
  selfSigned = true,
  writeToDisk = true,
}: {
  days?: number,
  domain?: string,
  outdir?: string,
  selfSigned?: boolean,
  writeToDisk?: boolean,
} = {}): Promise<{
  certificate?: string,
  clientKey?: string,
  csr?: string,
  serviceKey?: string
} | void> => {
  const pathDist = outdir || (await getPkgJson()).file?.config?.PATH_DIST;

  if (!pathDist)
    return throwIt(`outdir required if PATH_DIST not in pkgjson.config`);

  const commonName = `*.${domain}`;
  const fsproto = getFsproto(writeToDisk);

  // where to save dev certs
  // @see https://github.com/Dexus/pem/search?q=PEMJS_TMPDIR
  // ^ to understand why this is required and where its used
  process.env.PEMJS_TMPDIR = `${pathDist}/certs`;

  let certificate, clientKey, csr, serviceKey;

  const msgs = [],
    names = {
      certificate: `${process.env.PEMJS_TMPDIR}/` + `${domain}.certificate`,
      clientKey: `${process.env.PEMJS_TMPDIR}/` + `${domain}.clientKey`,
      csr: `${process.env.PEMJS_TMPDIR}/` + `${domain}.csr`,
      serviceKey: `${process.env.PEMJS_TMPDIR}/` + `${domain}.serviceKey`,
    };
  try {
    [certificate, clientKey, csr, serviceKey] = await fsproto.readFiles([
      { filename: names.certificate },
      { filename: names.clientKey },
      { filename: names.csr },
      { filename: names.serviceKey },
    ]);

    if (!certificate || !serviceKey || !csr || !clientKey) return throwIt('couldnt read dev SSL keys');

    const certValid = await pem.promisified.checkCertificate(certificate);

    if (!certValid) return throwIt('need to create new dev cert');

    return {
      certificate,
      clientKey,
      csr,
      serviceKey,
    };
  } catch (e) {
    msgs.push(e.message);
  }

  try {
    ({ certificate, clientKey, csr, serviceKey } = await pem.promisified.createCertificate({
      selfSigned,
      days,
      commonName,
    }));

    if (certificate instanceof Error) {
      logIt('\n\n could not create certs', certificate);

      return { certificate: '', clientKey: '', csr: '', serviceKey: '' };
    }
    if (!certificate || !serviceKey || !csr || !clientKey)
      return throwIt('@noahedwardhall needs to fix @nodeproto/envproto');

    // TODO: this is annotated as an array of strings, but likely should be an array of objects like it is here
    fsproto.writeFiles([
        { filename: names.certificate, data: certificate },
        { filename: names.clientKey, data: clientKey },
        { filename: names.csr, data: csr },
        { filename: names.serviceKey, data: serviceKey },
      ]);

      return Object.freeze({ certificate, clientKey, csr, serviceKey });
  } catch (e) {
    logIt(
      '\n\n could not retrieve, create, or save new|old dev certs',
      msgs.concat(e.message),
      e
    );
  }
};

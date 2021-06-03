'use strict';

/**
 * shit related to ssl certs
 * @see https://github.com/Dexus/pem/blob/master/test/pem.spec.js
 */


import { fsproto } from '../index.mjs';
import path from 'path';
import pem from 'pem';

export const getDevCert = async ({
  selfSigned = true,
  days = 7,
  domain = process.env.DEV_DOMAIN || 'localhost',
  tmpDir = process.env.PEMJS_TMPDIR,

  // dependent
  commonName = `*.${domain}`,

  ...opts
} = {}) => {
  // where to save dev certs
  if (!tmpDir) process.env.PEMJS_TMPDIR = path.normalize(path.dirname(fsproto.parentUri().replace('file:','')) + '/../envproto/certs');

  // get cert and key with name DOMAIN.serviceKey & DOMAIN.certificate
  let certificate, clientKey, csr, serviceKey;
  const names = {
    certificate: process.env.PEMJS_TMPDIR + '/' + `${domain}.certificate`,
    clientKey: process.env.PEMJS_TMPDIR + '/' + `${domain}.clientKey`,
    csr: process.env.PEMJS_TMPDIR + '/' + `${domain}.csr`,
    serviceKey: process.env.PEMJS_TMPDIR + '/' + `${domain}.serviceKey`,
  };

  try {
    ([
      certificate,
      clientKey,
      csr,
      serviceKey,
    ] = await fsproto.readFiles([
      { filename: names.certificate },
      { filename: names.clientKey },
      { filename: names.csr },
      { filename: names.serviceKey },
    ]));


    if (!certificate || !serviceKey || !csr || !clientKey) throw 'couldnt read dev keys';


    const certValid = await pem.promisified.checkCertificate(certificate);

    if (!certValid) throw 'need to create new dev cert';

    return {
      certificate,
      clientKey,
      csr,
      serviceKey,
    };
  } catch (e) {}

   try {
    ({
      certificate,
      clientKey,
      csr,
      serviceKey,
    } = await pem.promisified.createCertificate({
      selfSigned,
      days,
      commonName,
    }));

    const filesSaved = await fsproto.writeFiles([
      { filename: names.certificate, data: certificate },
      { filename: names.clientKey, data: clientKey },
      { filename: names.csr, data: csr },
      { filename: names.serviceKey, data: serviceKey },
    ]);
    return  { certificate, clientKey, csr, serviceKey };
  } catch (e) {
    console.error('\n\n could not retrieve, create, or save new|old dev certs', e)
  }
}

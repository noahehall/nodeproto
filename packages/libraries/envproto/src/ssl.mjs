/**
 * shit related to ssl certs
 * @see https://github.com/Dexus/pem/blob/master/test/pem.spec.js
 */
import "assert";
import { dirs, getFsproto } from '@nodeproto/wtf';
import pem from 'pem';

const fsproto = getFsproto(process.env.IS_TEST);

const getRequireOrImport = () => dirs.isCjs()
  ? __filename // eslint-disable-line
  : import.meta.url;

export const getDevCert = async ({
  days = 7,
  domain = process.env.DEV_DOMAIN || 'localhost',
  selfSigned = true,
  tmpDir = process.env.PEMJS_TMPDIR,


  // dependent
  commonName = `*.${domain}`,
} = {}) => {
  // where to save dev certs
  if (!tmpDir) process.env.PEMJS_TMPDIR = `${dirs.dirname(getRequireOrImport())}/certs`;
  let
    certificate,
    clientKey,
    csr,
    serviceKey
  ;
  const
    msgs = [],
    names = {
      certificate: `${process.env.PEMJS_TMPDIR}/` + `${domain}.certificate`,
      clientKey: `${process.env.PEMJS_TMPDIR}/` + `${domain}.clientKey`,
      csr: `${process.env.PEMJS_TMPDIR}/` + `${domain}.csr`,
      serviceKey: `${process.env.PEMJS_TMPDIR}/` + `${domain}.serviceKey`,
    }
  ;

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

    if (!certificate || !serviceKey || !csr || !clientKey) throw new Error('couldnt read dev keys');

    const certValid = await pem.promisified.checkCertificate(certificate);

    if (!certValid) throw new Error('need to create new dev cert');

    return {
      certificate,
      clientKey,
      csr,
      serviceKey,
    };
  } catch (e) { msgs.push(e.message); }

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

    if (certificate instanceof Error) {
      console.info(
        '\n\n could not create certs',
        certificate
      );

      return {};
    } else if (!certificate || !serviceKey || !csr || !clientKey) throw new Error('@noahedwardhall needs to fix @nodeproto/lib/envproto');

    return fsproto.writeFiles([
      { filename: names.certificate, data: certificate },
      { filename: names.clientKey, data: clientKey },
      { filename: names.csr, data: csr },
      { filename: names.serviceKey, data: serviceKey },
    ]).then(() => ({ certificate, clientKey, csr, serviceKey }));
  } catch (e) {
    console.error(
      '\n\n could not retrieve, create, or save new|old dev certs',
      msgs.concat(e.message),
      e
    );
  }
};

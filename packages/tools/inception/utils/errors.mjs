/**
 * Inception custom errors
 *
 * TODO
 * +eventually each error will have custom properties, hence the repition
 */

const ERRORS = {};

// TODO: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
// @see https://stackoverflow.com/questions/47248741/add-properties-to-javascript-error-object
class InceptionError extends Error {
  constructor (fnName, { msg, type, ...data }) {
    super();

    this.name = fnName;
    this.type = type;
    this.message = msg;
    this.__data = data;
  };
};

const throwError = (fnName, data) => { throw new InceptionError(fnName, data); };


ERRORS.csc = 'createServiceConfig';
export const ErrorCreateServiceConfig = (
  msg = 'user error', data = {}, type = 'required'
) => throwError(
  ERRORS.csc, { msg, data, type }
);

ERRORS.cpmp = 'createPkgManagementPlanError';
/**
 * throws error occurred while creating pkg management plans for a service configuration
 *
 * @param {string} [msg='user error'] summary of error
 * @param {*} [data={}] - additional information related to pkg management plan creation errors
 * @param {string} [type='required'] type of pkg management plan creation error
 */
export const ErrorCreatePkgManagementPlan = (
  msg = 'user error', data = {}, type = 'required'
) => throwError(
  ERRORS.cpmp, { msg, data, type }
);

ERRORS.csf = 'compileServiceDefinitionsError';
/**
 * throws error occurred during compilation of service definitions
 *
 * @param {string} [msg='user error'] summary of error
 * @param {*} [data={}] - additional information related to service definition compilation errors
 * @param {string} [type='required'] type of service definition compilation error
 */
export const ErrorCompileServiceDefinitions = (
  msg = 'user error', data = {}, type = 'required'
) => throwError(
  ERRORS.csf, { msg, data, type }
);


// TODO
ERRORS.ri = 'runInceptionError';
export const ErrorRunInception = (
  msg = 'user error', data = {}, type = 'run services'
) => throwError(
  ERRORS.ri, { msg, data, type }
);

ERRORS.i = 'inceptionError';
/**
 * throws error occurred during invocation of @nodeproto/inception
 *
 * @param {string} [msg='user error'] summary of error
 * @param {*} [data={}] - additional information related to inception invocation errors
 * @param {string} [type='invocation'] type of inception invocation error
 */
export const ErrorInception = (
  msg = 'user error', data = {}, type = 'invocation'
) => throwError(
  ERRORS.i, { msg, data, type }
);

ERRORS.bp = 'buildPkgsError';
/**
 * throws error occurred during invocation of @nodeproto/inception
 *
 * @param {string} [msg='user error'] summary of error
 * @param {*} [data={}] - additional information related to inception invocation errors
 * @param {string} [type='invocation'] type of inception invocation error
 */
export const ErrorBuildPkgs = (
  msg = 'user error', data = {}, type = 'build pkgs'
) => throwError(
  ERRORS.bp, { msg, data, type }
);

ERRORS.cdb = 'cdBackError';
/**
 * throws error occurred during invocation of @nodeproto/inception
 *
 * @param {string} [msg='user error'] summary of error
 * @param {*} [data={}] - additional information related to inception invocation errors
 * @param {string} [type='invocation'] type of inception invocation error
 */
export const ErrorCdBack = (
  msg = 'user error', data = {}, type = 'changing directory'
) => throwError(
  ERRORS.cdb, { msg, data, type }
);

ERRORS.lp = 'linkPkgsError';
/**
 * throws error occurred during invocation of @nodeproto/inception
 *
 * @param {string} [msg='user error'] summary of error
 * @param {*} [data={}] - additional information related to inception invocation errors
 * @param {string} [type='invocation'] type of inception invocation error
 */
export const ErrorLinkPkgs = (
  msg = 'user error', data = {}, type = 'changing directory'
) => throwError(
  ERRORS.lp, { msg, data, type }
);

ERRORS.wp = 'watchPkgsError';
/**
 * throws error occurred during invocation of @nodeproto/inception
 *
 * @param {string} [msg='user error'] summary of error
 * @param {*} [data={}] - additional information related to inception invocation errors
 * @param {string} [type='invocation'] type of inception invocation error
 */
export const ErrorWatchPkgs = (
  msg = 'user error', data = {}, type = 'changing directory'
) => throwError(
  ERRORS.wp, { msg, data, type }
);

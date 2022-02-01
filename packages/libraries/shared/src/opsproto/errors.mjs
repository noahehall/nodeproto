// @flow

export const throwIt = (msg: string | Error) => {

  throw typeof msg  === 'string'
    ? new Error(msg)
    : msg;
};

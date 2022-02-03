// @flow

export const throwIt = (msg: string | Error): void => {
  throw typeof msg  === 'string'
    ? new Error(msg)
    : msg;
};

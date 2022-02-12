// @flow

export const throwIt = (msg: string | Error, ...details?: any[]): void => {
  if (details.length) console.error(details);

  throw typeof msg  === 'string'
    ? new Error(msg)
    : msg;
};

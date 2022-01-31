// @flow

export const noop = (): void => void 0;

const logFunction = (...msgs: any[]): void => console.info(...msgs);
export const logIt: () => void = !process.env.VERBOSE ? noop : logFunction;

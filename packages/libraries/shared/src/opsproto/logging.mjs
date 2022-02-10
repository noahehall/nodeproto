// @flow

interface VoidFnInterface {
  (...arggs: mixed[]): void;
}

export const noop: VoidFnInterface = () => void 0;

const logFunction: VoidFnInterface = (...msgs) => console.info(...msgs);
// TODO: fix for envs (e.g. browser) where process isnt defined
export const logIt: VoidFnInterface = typeof process === 'undefined' || !process.env.VERBOSE ? noop : logFunction;

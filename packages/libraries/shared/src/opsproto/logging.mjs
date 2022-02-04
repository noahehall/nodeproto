// @flow

interface VoidFnInterface {
  (...arggs: mixed[]): void;
}

export const noop: VoidFnInterface = () => void 0;

const logFunction: VoidFnInterface = (...msgs) => console.info(...msgs);
export const logIt: VoidFnInterface = !process.env.VERBOSE ? noop : logFunction;

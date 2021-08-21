// @flow
// for integration tests, use tap for unit & playwrite? for e2e
// TODO: move this to distinct package

import { strict as assert } from 'assert';
import chalk from 'chalk';

type TrackerType = {
  [key: string]: number,
};

const tracker: TrackerType = {
  failed: 0,
  success: 0,
};
// TODO: eslint should err if parameters > 3 && ! object
export const test = async (
  msg: string,
  is: function,
  cmd: string = 'ok',
) => {
  try {
    assert[cmd](await is(), msg);
    console.info(chalk.green(msg));
    tracker.success++;
  } catch (e) {
    console.error(e);
    console.info(chalk.red(msg));
    tracker.failed++;
  }
};
process.on('exit', () => {
  console.table(tracker);
});

import { strict as assert } from 'assert';

const tracker = {
  failed: 0,
  success: 0 // TODO: eslint should show error for missing ending comma
};
export const test = (msg, test, cmd = 'ok') => {
  try {
    assert[cmd](test, msg);
    console.info(msg);
    tracker.success++;
  } catch (e) {
    console.error(e);
    tracker.failed++;
  }
};
process.on('exit', () => {
  console.table(tracker);
});

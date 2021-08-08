import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import {
  buildEnv,
  clearBaseEnv,
  syncConfigWithEnv,
  syncEnvAndConfig,
  syncEnvWithConfig,
  updateBaseEnv,
  wrapValue,
} from './env.mjs';

const test = suite('env.mjs');

test.before.each(() => clearBaseEnv());

test('buildEnv', () => {
  const parsed = { a: 'b' };
  const env = buildEnv(parsed);

  assert.equal(env, { "process.env.a": wrapValue(parsed.a) }, 'wraps each value in object');

  assert.is(process.env.a, 'b', 'updates process.env');
});

test('syncEnvWithConfig', () => {
  // need to set to empty string
  // syncEnvWithConfig only updates env properties whose values are empty strings
  updateBaseEnv({ a: '' });

  const config = { a: 'b' };
  const { parsed, processEnv } = syncEnvWithConfig({ config });

  assert.equal(parsed, config, 'upserts config into parsed');
  assert.equal(processEnv, { "process.env.a": wrapValue(config.a) }, 'wraps each value in object');
  assert.equal(process.env.a, config.a, 'updates process.env');
});

test('syncConfigWithEnv', () => {
  const env = { a: 'b' };
  updateBaseEnv(env);

  const config = syncConfigWithEnv({ config: { b: 'a', a: 'override me' } });

  assert.equal(config.a, env.a, 'upserts env into config');
  assert.equal(config.b, 'a', 'leaves nonmatching values intact');
});

test('syncEnvAndConfig', () => {
  // we want ci to always be true
  const requiredEnv = { ci: true, overrideMe: '' };
  updateBaseEnv(requiredEnv);

  // ci is normally false
  // we provide a defualt value that should be used
  const prevConfig = { ci: false, overrideMe: 'withThis' };

  // config & process env should match
  const { config, processEnv } = syncEnvAndConfig({ config: prevConfig });

  // ci is now true in process.env, processEnv (e.g. webpack|esbuild), & config
  assert.is(config.ci, requiredEnv.ci, 'ci should be true in config');
  assert.is(processEnv['process.env.ci'], wrapValue(requiredEnv.ci), 'ci should be true in processEnv');
  assert.is(process.env.ci, String(requiredEnv.ci), 'ci should be true in process.env');

  // overrideMe is now 'withThis' in process.env, processEnv & config
  assert.is(config.overrideMe, prevConfig.overrideMe, 'overrideMe should be updated in config');
  assert.is(processEnv['process.env.overrideMe'], wrapValue(prevConfig.overrideMe), 'overrideMe should updated in processEnv');
  assert.is(process.env.overrideMe, prevConfig.overrideMe, 'overrideMe should be updated in process.env');
});

test.run();

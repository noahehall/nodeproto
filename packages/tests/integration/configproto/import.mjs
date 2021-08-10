import fs from 'fs/promises';
import path from 'path';
import { test } from '../../index.mjs'; // todo should be internal import

(async () => {
  const baseEslintConfig = await fs.readFile(path.resolve('node_modules/@nodeproto/configproto/eslint/base.eslintrc.yml'), 'utf-8');

  test('can import the base eslint config', baseEslintConfig);
})();

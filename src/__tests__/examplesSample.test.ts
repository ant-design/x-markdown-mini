import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const root = resolve(__dirname, '../..');

describe('shared mini-program example content', () => {
  it.each(['wechat', 'alipay'] as const)(
    'keeps the %s sample generated from the shared source',
    (platform) => {
      const { createSample } = require(resolve(root, 'examples/sample.js'));
      const { SAMPLE } = require(resolve(root, `examples/${platform}/pages/sample.js`));

      expect(SAMPLE).toBe(createSample(platform));
    },
  );
});

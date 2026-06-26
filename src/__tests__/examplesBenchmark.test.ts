import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(__dirname, '../..');

function readExample(platform: 'wechat' | 'alipay', file: string) {
  const ext = platform === 'wechat' ? 'wxml' : 'axml';
  const template = readFileSync(
    resolve(root, `examples/${platform}/pages/benchmark/benchmark.${ext}`),
    'utf8',
  );
  const script = readFileSync(
    resolve(root, `examples/${platform}/pages/benchmark/benchmark.js`),
    'utf8',
  );
  const config = JSON.parse(
    readFileSync(resolve(root, `examples/${platform}/pages/benchmark/benchmark.json`), 'utf8'),
  ) as { usingComponents?: Record<string, string> };
  return { template, script, config };
}

describe('mini-program benchmark examples', () => {
  it.each(['wechat', 'alipay'] as const)(
    '%s separates JS throughput from real streaming render benchmarks',
    (platform) => {
      const { template, script, config } = readExample(platform, 'benchmark');

      expect(template).toContain('JS 吞吐率');
      expect(template).toContain('真实流式渲染');
      expect(template).toContain('流式渲染器');
      expect(template).toContain('marked + rich-text');
      expect(template).toContain('mp-html');
      expect(script).toContain("mode: 'js'");
      expect(script).toContain("streamRenderer: 'x-markdown-mini'");
      expect(script).toContain('onRendererTap');
      expect(script).toContain('onModeTap');
      expect(script).toContain('runJsBenchmark');
      expect(script).toContain('runStreamingBenchmark');
      expect(script).toContain('renderStreamingFrame');
      expect(script).toContain('createMarkedRichTextSuite');
      expect(script).toContain('throughputText');
      expect(script).toContain('framesText');
      expect(script).toContain('setDataText');
      expect(script).toContain('STREAM_FRAME_DELAY');
      expect(script).toContain('streamProgressText');
      expect(script).toContain('MiniNodeRenderer');
      expect(script).toContain('safeRequire');
      expect(script).toContain('JS_BENCHMARKS');
      expect(script).not.toContain('require(paths[i])');
      if (platform === 'wechat') {
        expect(script).toContain("../../miniprogram_npm/mp-html/plugins/markdown/index");
        expect(script).toContain("../../miniprogram_npm/mp-html/plugins/markdown/marked.min");
        expect(script).toContain("../../miniprogram_npm/mp-html/parser");
        expect(script).toContain("../../miniprogram_npm/mini-html-parser2/lib/index");
      } else {
        expect(script).toContain("require('mp-html/plugins/markdown/index')");
        expect(script).toContain("require('mp-html/plugins/markdown/marked.min')");
        expect(script).toContain("require('mp-html/dist/mp-alipay/parser')");
        expect(script).toContain("require('mini-html-parser2')");
      }
      expect(script).toContain('Markdown -> HTML -> mp-html nodes');
      expect(script).toContain('Markdown -> HTML -> rich-text nodes');
      expect(script).not.toContain('node_modules/mp-html/plugins/markdown/index');
      expect(script).not.toContain('../../../../node_modules/mp-html');
      expect(config.usingComponents?.['mini-node-renderer']).toContain(
        '@ant-design/x-markdown-mini/es/MiniNodeRenderer/index',
      );
      expect(config.usingComponents?.['mp-html']).toBe(
        platform === 'wechat' ? 'mp-html' : 'mp-html/dist/mp-alipay/index',
      );
    },
  );

  it('keeps platform-specific mainstream baselines explicit', () => {
    const wechatExample = readExample('wechat', 'benchmark');
    const alipayExample = readExample('alipay', 'benchmark');
    const wechat = wechatExample.script;
    const alipay = alipayExample.script;

    expect(wechat).toContain('createTowxmlSuite');
    expect(wechat).toContain("../../miniprogram_npm/towxml/index");
    expect(wechat).not.toContain('../../../../node_modules/towxml');
    expect(wechatExample.template).toContain('<towxml');
    expect(wechatExample.config.usingComponents?.towxml).toBe('towxml/towxml');
    expect(existsSync(resolve(root, 'examples/wechat/miniprogram_npm/mp-html/index.json'))).toBe(
      true,
    );
    expect(existsSync(resolve(root, 'examples/wechat/miniprogram_npm/towxml/towxml.json'))).toBe(
      true,
    );
    const towxmlDecode = JSON.parse(
      readFileSync(resolve(root, 'examples/wechat/miniprogram_npm/towxml/decode.json'), 'utf8'),
    ) as { usingComponents?: Record<string, string> };
    expect(towxmlDecode.usingComponents?.decode).toBe('./decode');
    expect(Object.values(towxmlDecode.usingComponents || {})).not.toContain('/towxml/decode');
    expect(wechat).toContain('wxParse / wemark');
    expect(alipay).toContain('rich-text');
    expect(alipay).not.toContain('createTowxmlSuite');
    expect(alipay).not.toContain('Wechat only');
    expect(alipay).not.toContain("'/node_modules/towxml");
  });

  it('keeps the WeChat run button from clipping text', () => {
    const css = readFileSync(
      resolve(root, 'examples/wechat/pages/benchmark/benchmark.wxss'),
      'utf8',
    );

    expect(css).toContain('.run-button');
    expect(css).toContain('display: flex');
    expect(css).toContain('align-items: center');
    expect(css).toContain('height: auto');
  });
});

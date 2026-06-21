import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

const root = resolve(__dirname, '../..');
const require = createRequire(import.meta.url);

describe('mini-program streaming examples', () => {
  for (const platform of ['alipay', 'wechat']) {
    it(`${platform} exposes the same cancellable cumulative stream player`, () => {
      const helper = resolve(root, `examples/${platform}/pages/streaming.js`);
      expect(existsSync(helper), `${helper} must exist`).toBe(true);

      const { createStreamPlayer } = require(helper) as {
        createStreamPlayer: (options: {
          content: string;
          chunkSize?: number;
          interval?: number;
          onFrame: (content: string, streaming: boolean, status: string) => void;
        }) => { play: () => void; showAll: () => void; dispose: () => void };
      };

      vi.useFakeTimers();
      const frames: Array<[string, boolean, string]> = [];
      const player = createStreamPlayer({
        content: 'AI流式渲染',
        chunkSize: 2,
        interval: 20,
        onFrame: (content, streaming, status) => frames.push([content, streaming, status]),
      });

      player.play();
      vi.runAllTimers();
      expect(frames[0]).toEqual(['', true, 'streaming']);
      expect(frames.at(-1)).toEqual(['AI流式渲染', false, 'done']);
      expect(frames.map(([content]) => content)).toEqual(['', 'AI', 'AI流式', 'AI流式渲染']);

      player.play();
      player.showAll();
      vi.runAllTimers();
      expect(frames.at(-1)).toEqual(['AI流式渲染', false, 'idle']);
      player.dispose();
      vi.useRealTimers();
    });

    it(`${platform} defaults to a human-visible LLM-like pace`, () => {
      const helper = resolve(root, `examples/${platform}/pages/streaming.js`);
      const { createStreamPlayer } = require(helper) as {
        createStreamPlayer: (options: {
          content: string;
          onFrame: (content: string, streaming: boolean, status: string) => void;
        }) => { play: () => void };
      };

      vi.useFakeTimers();
      const content = '真实LLM返回速度';
      const frames: Array<[string, boolean, string]> = [];
      const player = createStreamPlayer({
        content,
        onFrame: (value, streaming, status) => frames.push([value, streaming, status]),
      });

      player.play();
      vi.advanceTimersByTime(100);
      expect(frames.at(-1)).toEqual(['', true, 'streaming']);

      vi.advanceTimersByTime(30);
      const firstBurst = frames.at(-1)!;
      expect(firstBurst[0].length).toBeGreaterThan(0);
      expect(firstBurst[0].length).toBeLessThan(content.length);
      expect(firstBurst[1]).toBe(true);

      vi.runAllTimers();
      expect(frames.at(-1)).toEqual([content, false, 'done']);
      vi.useRealTimers();
    });
  }

  it('all four integration pages expose a top streaming switch', () => {
    const files = [
      'examples/alipay/pages/component/component.axml',
      'examples/alipay/pages/js/js.axml',
      'examples/wechat/pages/component/component.wxml',
      'examples/wechat/pages/js/js.wxml',
    ];

    for (const file of files) {
      const source = readFileSync(resolve(root, file), 'utf8');
      expect(source, file).toContain('class="stream-control"');
      expect(source, file).toContain('onStreamingChange');
    }
  });

  it('all four integration pages pass streaming state to text animation', () => {
    const templates = [
      'examples/alipay/pages/js/js.axml',
      'examples/wechat/pages/js/js.wxml',
    ];
    const scripts = [
      'examples/alipay/pages/js/js.js',
      'examples/wechat/pages/js/js.js',
    ];

    for (const file of templates) {
      expect(readFileSync(resolve(root, file), 'utf8'), file).toContain(
        'animation="{{streamingActive}}"',
      );
    }
    for (const file of scripts) {
      const source = readFileSync(resolve(root, file), 'utf8');
      expect(source, file).toContain('streamingActive: false');
      expect(source, file).toContain('streamingActive: streaming');
    }

    for (const platform of ['alipay', 'wechat']) {
      const source = readFileSync(
        resolve(root, `src/components/${platform}/Markdown/index.ts`),
        'utf8',
      );
      expect(source, platform).toContain('animation: false');
      expect(source, platform).toMatch(/setData\(\{[\s\S]*?animation:\s*!!/);
    }

    const wechatJsExample = readFileSync(
      resolve(root, 'examples/wechat/pages/js/js.js'),
      'utf8',
    );
    expect(wechatJsExample).toContain('reconcileTextAnimation(flat, this.textAnimation)');
  });

  it('wechat text nodes use user-select instead of deprecated selectable', () => {
    const renderer = readFileSync(
      resolve(root, 'src/components/wechat/MiniNodeRenderer/index.wxml'),
      'utf8',
    );
    expect(renderer).not.toMatch(/^    selectable="\{\{selectable\}\}"/m);
    expect(renderer).toContain('user-select="{{selectable}}"');

    // This is a custom-component property, not the deprecated native <text>
    // attribute, so the public Markdown -> MiniNodeRenderer contract stays put.
    const markdown = readFileSync(
      resolve(root, 'src/components/wechat/Markdown/index.wxml'),
      'utf8',
    );
    expect(markdown).toContain('selectable="{{selectable}}"');
  });
});

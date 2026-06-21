import type {
  MiniNode,
  RenderContext,
  Token,
  Tokens,
  XMarkdownExtension,
} from '@ant-design/x-markdown-mini';

const FOOTNOTE_RULE = /^\[\^(?:([^\]:]+):)?([\s\S]+?)\]/;

export function createFootnoteExtension(defaultLabel = '注'): XMarkdownExtension {
  return {
    extensions: [
      {
        name: 'footnote',
        level: 'inline',
        start(src: string): number | undefined {
          const index = src.indexOf('[^');
          return index < 0 ? undefined : index;
        },
        tokenizer(src: string): Tokens.Generic | undefined {
          const match = FOOTNOTE_RULE.exec(src);
          if (!match) return undefined;
          return {
            type: 'footnote',
            raw: match[0],
            label: (match[1] ?? defaultLabel).trim(),
            content: match[2].trim(),
          } as unknown as Tokens.Generic;
        },
        miniRenderer(token: Token, _ctx: RenderContext): MiniNode {
          const footnote = token as unknown as { label: string; content: string };
          return {
            name: 'footnote',
            tag: 'footnote',
            attrs: {
              label: footnote.label,
              content: footnote.content,
              class: 'md-footnote',
            },
          };
        },
      },
    ],
  };
}

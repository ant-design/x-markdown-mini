import type { MiniNode, Tokens, XMarkdownExtension } from '@ant-design/x-markdown-mini';

/**
 * 覆盖内置 `table` 渲染。
 *
 * extension 的 `name` 命中内置 token 类型（这里是 `table`）时，`miniRenderer`
 * 会完全接管该 token 的渲染，替换内置结果 —— 与 CodeHighlight 覆盖 `code` 同理。
 * 这里只提供 `miniRenderer`、不提供 `tokenizer`：解析仍走 marked 内置表格分词器，
 * 只有「Token → MiniNode」这一步被替换。把表格改渲染成「每行一条」的列表。
 *
 * 返回 `null` 或空数组则回退到内置渲染。
 */
export function createCustomTableExtension(): XMarkdownExtension {
  return {
    extensions: [
      {
        name: 'table',
        level: 'block',
        miniRenderer(token): MiniNode[] {
          const t = token as unknown as Tokens.Table;
          const headers = (t.header ?? []).map((cell) => cell.text);
          const items: MiniNode[] = (t.rows ?? []).map((row) => {
            const line = row
              .map((cell, i) => (headers[i] ? `${headers[i]}：${cell.text}` : cell.text))
              .join('，');
            return {
              name: 'li',
              attrs: { class: 'md-list-item' },
              children: [
                { name: 'text', attrs: { class: 'md-list-marker', value: '•' } },
                {
                  name: 'div',
                  attrs: { class: 'md-list-content' },
                  children: [{ name: 'text', attrs: { value: line } }],
                },
              ],
            };
          });
          return [{ name: 'ul', attrs: { class: 'md-list' }, children: items }];
        },
      },
    ],
  };
}

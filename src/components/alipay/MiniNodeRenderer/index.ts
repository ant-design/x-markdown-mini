export {};

import { getTableShadowState } from '../../shared/tableScroll.js';
import { resolveLinkHref } from '../../shared/flattenInline.js';
import {
  areKatexFontsReady,
  ensureKatexFonts,
  onKatexFontsReady,
} from '../../shared/loadKatexFonts.js';

declare const Component: (opts: Record<string, unknown>) => void;
declare const my: any;

type EdgeShadowState = { left: boolean; right: boolean };

function copyToClipboard(text: string): void {
  if (!text) return;
  my.setClipboard({
    text,
    success: () => my.showToast({ content: '已复制', duration: 1200 }),
    fail: () => my.showToast({ content: '复制失败' }),
  });
}

// JS 接入页直接用 <mini-node-renderer>（不经高层 <Markdown>），所以字体注册必须在这里
// 触发。务必复用 shared/loadKatexFonts —— 它把 KaTeX 全部 20 个字面以 global 注册；早先
// 这里有个只注册 KaTeX_Math 的本地残桩，真机上其余字体（KaTeX_Main 数字/符号、KaTeX_Size
// 定界符、KaTeX_AMS…）全部回退系统字体，导致「字体很奇怪、和模拟器不一样」。
function hk(nodes: unknown[] | undefined): boolean {
  return !!nodes && nodes.some((node: any) =>
    !!node && (String((node.attrs || {}).class || '').indexOf('katex') > -1 ||
    hk(node.children)));
}

interface MiniNodeRendererProps {
  nodes: unknown[];
  selectable: boolean;
  animation: boolean;
  /** 自定义组件标签白名单：命中的节点交给宿主作用域插槽渲染。 */
  slotComponents: string[];
  onTap?: (e?: unknown) => void;
  onAppear?: (e?: unknown) => void;
}

const defaultProps: MiniNodeRendererProps = {
  nodes: [],
  selectable: true,
  animation: false,
  slotComponents: [],
};

Component({
  props: defaultProps,
  data: {
    shadows: {} as Record<string, EdgeShadowState>,
    // 字体就绪后卸载-重挂一次，强制公式 <text> 用已注册字体重画（仅最外层实例会被回调，见 loadKatexFonts）。
    katexReflow: true,
  },
  vw: {} as Record<string, number>,
  cw: {} as Record<string, number>,
  timer: null as ReturnType<typeof setTimeout> | null,
  mounted: false,
  // 每实例最多重排一次；animation 近似「流式进行中」，用于 C1：流式期间不显式重排，空闲态补一次。
  _katexReflowed: false,
  _katexReflowArmed: false,
  _isStreaming: false,
  didMount(this: any) {
    this.mounted = true;
    this._isStreaming = !!this.props.animation;
    if (hk(this.props.nodes)) ensureKatexFonts();
    this._maybeKatexReflow();
    this._scheduleMeasure();
  },
  didUpdate(this: any, prevProps: MiniNodeRendererProps) {
    if (prevProps.nodes !== this.props.nodes) {
      this._isStreaming = !!this.props.animation;
      if (hk(this.props.nodes)) ensureKatexFonts();
      this._maybeKatexReflow();
      this._scheduleMeasure();
    }
  },
  didUnmount(this: any) {
    this.mounted = false;
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = null;
  },
  methods: {
    // 每实例至多重排一次：无公式 / 字体已就绪 / 流式进行中，均跳过——消除「每个 chunk 全页闪」。
    _maybeKatexReflow(this: any) {
      if (this._katexReflowed || this._katexReflowArmed) return;
      if (!hk(this.props.nodes)) return;
      if (areKatexFontsReady()) { this._katexReflowed = true; return; }
      if (this._isStreaming) return;
      this._katexReflowArmed = true;
      onKatexFontsReady(() => {
        this._katexReflowArmed = false;
        if (!this.mounted || this._katexReflowed || this._isStreaming) return;
        this._katexReflowed = true;
        this._katexFontReflow();
      });
    },

    // 字体就绪后强制重排：卸载再重挂节点子树，让公式 <text> 用已注册的字体重绘。
    _katexFontReflow(this: any) {
      if (!this.mounted) return;
      this.setData({ katexReflow: false }, () => {
        if (this.mounted) this.setData({ katexReflow: true });
      });
    },

    _tap(this: any, e: any) {
      // 链接内置交互：小程序无法直接打开外部 http(s) 链接，命中 anchor 叶子时把
      // href 复制到剪贴板并 Toast 提示。dataset.data 是被点 <text> 上绑的整棵 node；
      // 只有 anchor 叶子带 href，普通文本/块返回 null，因此该分支只在点链接时触发。
      const href = resolveLinkHref(e?.currentTarget?.dataset?.data);
      if (href) {
        my.setClipboard({
          text: href,
          success: () => my.showToast({ content: '链接已复制', duration: 1500 }),
        });
      }
      // 仍向页面转发 tap，消费方可自定义（如跳转 web-view）。
      this.props.onTap?.(e);
    },
    _appear(this: any, e: unknown) {
      this.props.onAppear?.(e);
    },
    _copy(this: any, e: any) {
      const ds = e && e.currentTarget && e.currentTarget.dataset;
      copyToClipboard((ds && ds.copy) || '');
    },
    _scheduleMeasure(this: any) {
      if (this.timer !== null) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.timer = null;
        if (!this.mounted) return;
        this._measure();
      }, 160);
    },
    _measure(this: any) {
      if (!this.mounted) return;
      const query = my.createSelectorQuery().in(this);
      query.selectAll('.md-table-scroll').boundingClientRect();
      query.selectAll('.md-table').boundingClientRect();
      query.selectAll('.md-code-block').boundingClientRect();
      query.selectAll('.markdownx-code-body').boundingClientRect();
      query.exec((result: any[]) => {
        if (!this.mounted) return;
        const viewports = (result && result[0]) || [];
        const tables = (result && result[1]) || [];
        const codeViewports = (result && result[2]) || [];
        const codeBodies = (result && result[3]) || [];
        const contentByKey: Record<string, any> = {};
        const viewportWidths: Record<string, number> = {};
        const contentWidths: Record<string, number> = {};
        const shadows: Record<string, EdgeShadowState> = {};

        for (let i = 0; i < tables.length; i++) {
          const node = tables[i] || {};
          const key = String((node.dataset && node.dataset.scrollKey) || 'table-' + i);
          contentByKey[key] = node;
        }
        for (let i = 0; i < viewports.length; i++) {
          const viewport = viewports[i] || {};
          const key = String((viewport.dataset && viewport.dataset.scrollKey) || 'table-' + i);
          const defaultRight =
            String((viewport.dataset && viewport.dataset.defaultRight) || '') === 'true';
          const viewportWidth = Number(viewport.width) || 0;
          const contentWidth = Number((contentByKey[key] || {}).width) || viewportWidth;
          viewportWidths[key] = viewportWidth;
          contentWidths[key] = contentWidth;
          const state = getTableShadowState(0, contentWidth, viewportWidth);
          if (state.left || state.right || !defaultRight) shadows[key] = state;
        }
        for (let i = 0; i < codeBodies.length; i++) {
          const node = codeBodies[i] || {};
          const key = String((node.dataset && node.dataset.scrollKey) || 'code-' + i);
          contentByKey[key] = node;
        }
        for (let i = 0; i < codeViewports.length; i++) {
          const viewport = codeViewports[i] || {};
          const key = String((viewport.dataset && viewport.dataset.scrollKey) || 'code-' + i);
          const viewportWidth = Number(viewport.width) || 0;
          const contentWidth = Number((contentByKey[key] || {}).width) || viewportWidth;
          viewportWidths[key] = viewportWidth;
          contentWidths[key] = contentWidth;
        }

        this.vw = viewportWidths;
        this.cw = contentWidths;
        this.setData({ shadows });
      });
    },
    _updateShadow(this: any, e: any) {
      const ds = (e && e.currentTarget && e.currentTarget.dataset) || {};
      const detail = (e && e.detail) || {};
      const key = String(ds.scrollKey || 'table-0');
      const viewportWidth = this.vw[key] || 0;
      const scrollLeft = Number(detail.scrollLeft) || 0;
      const eventScrollWidth = Number(detail.scrollWidth) || 0;
      const measuredContentWidth = this.cw[key] || 0;
      const contentWidth = Math.max(
        eventScrollWidth,
        measuredContentWidth,
        scrollLeft + viewportWidth,
        viewportWidth,
      );
      if (eventScrollWidth) this.cw[key] = eventScrollWidth;
      const state = getTableShadowState(scrollLeft, contentWidth, viewportWidth);
      const current = this.data.shadows[key];
      const defaultRight = String(ds.defaultRight || '') === 'true';
      if (!current && defaultRight && !state.left && state.right) return;
      if (current && current.left === state.left && current.right === state.right) return;
      const shadows = Object.assign({}, this.data.shadows);
      shadows[key] = state;
      this.setData({ shadows });
    },
    _tableScroll(this: any, e: any) {
      this._updateShadow(e);
    },
    _codeScroll(this: any, e: any) {
      this._updateShadow(e);
    },
  },
});

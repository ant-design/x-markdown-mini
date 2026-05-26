(function () {
  var PLATFORM_STORAGE_KEY = 'xmd-doc-platform';

  function getDocPlatform() {
    var saved = window.localStorage.getItem(PLATFORM_STORAGE_KEY);
    return saved === 'wechat' || saved === 'alipay' ? saved : 'alipay';
  }

  function initPlatformAttribute() {
    var platform = getDocPlatform();
    document.documentElement.setAttribute('data-xmd-doc-platform', platform);
  }

  function flash(el) {
    el.setAttribute('data-copied', 'true');
    setTimeout(function () {
      el.removeAttribute('data-copied');
    }, 1400);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  function onClick(e) {
    var el = e.target.closest('[data-xmd-copy]');
    if (!el) return;
    var text = el.getAttribute('data-xmd-copy') || '';
    flash(el);
    copyText(text).catch(function () {
      /* Clipboard access can be blocked in embedded browsers. The command is still visible. */
    });
  }

  document.addEventListener('click', onClick, true);

  var searchItems = [
    ['首页', '/', 'x-markdown-mini Markdown 小程序 渲染层 AI 流式内容'],
    ['在线体验', '/playground', 'Playground 浏览器编辑 Markdown 实时预览 微信 支付宝'],
    ['文档', '/docs/quickstart', 'Docs 特性 API 示例 DEMO 文档'],
    ['文档概览', '/docs/quickstart', 'features API renderNodes markdown demo'],
    ['一次性渲染', '/docs/oneshot', 'renderNodes parse markdown 一次性渲染'],
    ['流式渲染', '/docs/streaming', 'streaming stableNodes liveTail 流式'],
    ['打字机模式', '/docs/typewriter', 'typewriter 打字机 动画'],
    ['动画', '/docs/animation', 'animation transitions 流式动画'],
    ['能力矩阵', '/docs/platforms', '微信 支付宝 平台 能力矩阵'],
    ['适配规则', '/docs/adapter-rules', 'adapter rules 标签 属性 降级'],
    ['自定义平台', '/docs/custom-platform', 'custom platform renderer 自定义平台'],
    ['API 参考', '/docs/api', 'API renderNodes tokens types'],
    ['类型导出', '/docs/types', 'TypeScript 类型导出'],
    ['Changelog', '/docs/changelog', '更新日志 版本变化'],
    ['Markdown 示例', '/examples/markdown', 'Markdown GFM 表格 代码块 示例'],
    ['流式示例', '/examples/streaming', 'Streaming demo basic typewriter animation'],
  ];

  function getSearchModal() {
    return document.querySelector('.xmd-search-modal');
  }

  function closeSearchModal() {
    var modal = getSearchModal();
    if (modal) {
      modal.remove();
      document.body.removeAttribute('data-xmd-search-open');
    }
  }

  function renderSearchResults(modal, keyword) {
    var list = modal.querySelector('.xmd-search-results');
    var query = keyword.trim().toLowerCase();
    var results = searchItems
      .map(function (item) {
        var title = item[0].toLowerCase();
        var haystack = item.join(' ').toLowerCase();
        var score = !query
          ? 1
          : title === query
            ? 4
            : title.indexOf(query) >= 0
              ? 3
              : haystack.indexOf(query) >= 0
                ? 2
                : 0;
        return { item: item, score: score };
      })
      .filter(function (entry) {
        return entry.score > 0;
      })
      .sort(function (a, b) {
        return b.score - a.score;
      })
      .slice(0, 8);

    list.innerHTML = results.length
      ? results
          .map(function (entry) {
            return (
              '<a class="xmd-search-result" href="' +
              entry.item[1] +
              '">' +
              '<span>' +
              entry.item[0] +
              '</span>' +
              '<small>' +
              entry.item[2] +
              '</small>' +
              '</a>'
            );
          })
          .join('')
      : '<div class="xmd-search-empty">未找到相关内容</div>';
  }

  function openSearchModal() {
    var existing = getSearchModal();
    if (existing) {
      var existingInput = existing.querySelector('input');
      if (existingInput) existingInput.focus();
      return;
    }

    var modal = document.createElement('div');
    modal.className = 'xmd-search-modal';
    modal.innerHTML =
      '<div class="xmd-search-backdrop" data-xmd-search-close></div>' +
      '<section class="xmd-search-panel" role="dialog" aria-modal="true" aria-label="站内搜索">' +
      '<div class="xmd-search-input-wrap">' +
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>' +
      '<input type="search" placeholder="输入关键字搜索..." autocomplete="off" />' +
      '<kbd>esc</kbd>' +
      '</div>' +
      '<div class="xmd-search-results"></div>' +
      '</section>';

    document.body.appendChild(modal);
    document.body.setAttribute('data-xmd-search-open', 'true');

    var input = modal.querySelector('input');
    renderSearchResults(modal, '');
    input.addEventListener('input', function () {
      renderSearchResults(modal, input.value);
    });
    input.focus();
  }

  function forceSearchModal(ev) {
    var isApple = /(mac|iphone|ipod|ipad)/i.test(navigator.platform || '');
    var isSearchShortcut =
      (isApple ? ev.metaKey : ev.ctrlKey) && ev.key && ev.key.toLowerCase() === 'k';

    if (!isSearchShortcut) return;

    ev.preventDefault();
    ev.stopImmediatePropagation();
    openSearchModal();
  }

  function onSearchShortcutClick(ev) {
    var el = ev.target.closest('.dumi-default-search-bar');
    if (!el) return;

    ev.preventDefault();
    ev.stopImmediatePropagation();
    openSearchModal();
  }

  function onSearchModalClick(ev) {
    if (ev.target.closest('[data-xmd-search-close]')) closeSearchModal();
  }

  function onSearchModalKeydown(ev) {
    if (ev.key === 'Escape') closeSearchModal();
  }

  document.addEventListener('keydown', forceSearchModal, true);
  document.addEventListener('click', onSearchShortcutClick, true);
  document.addEventListener('click', onSearchModalClick, true);
  document.addEventListener('keydown', onSearchModalKeydown, true);

  function setupDevDebug() {
    var params = new URLSearchParams(window.location.search);
    var isLocal =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '0.0.0.0';
    var debug = params.get('xmd-debug') === '1';

    if (isLocal) {
      document.body.setAttribute('data-xmd-dev', 'true');
      var badge = document.createElement('div');
      badge.className = 'xmd-dev-badge';
      badge.textContent = debug
        ? 'dev · layout debug on'
        : 'dev · add ?xmd-debug=1 for layout outlines';
      document.body.appendChild(badge);
    }

    if (debug) {
      document.body.setAttribute('data-xmd-debug', 'true');
    }
  }

  function bootstrap() {
    setupDevDebug();
    initPlatformAttribute();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();

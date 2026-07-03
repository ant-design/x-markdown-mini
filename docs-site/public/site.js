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

  function setDocPlatform(platform) {
    if (platform !== 'wechat' && platform !== 'alipay') return;
    try {
      window.localStorage.setItem(PLATFORM_STORAGE_KEY, platform);
    } catch (_) {
      /* localStorage can be blocked in embedded previews. */
    }
    document.documentElement.setAttribute('data-xmd-doc-platform', platform);
    syncPlatformTabs();
    // Notify the React demos (DocDemo/DemoCode/PhonePreview via useDocPlatform),
    // which listen for this event. Without it the sidebar toggle and the embedded
    // code/preview disagree and the code never swaps to .wxml/.axml.
    try {
      window.dispatchEvent(
        new CustomEvent('xmd-platform-change', { detail: { platform: platform } }),
      );
    } catch (_) {
      /* CustomEvent constructor may be unavailable in very old engines. */
    }
  }

  function syncPlatformTabs() {
    var platform = getDocPlatform();
    var tabs = document.querySelectorAll('.xmd-platform-tab');
    for (var i = 0; i < tabs.length; i++) {
      var tab = tabs[i];
      var active = tab.getAttribute('data-platform') === platform;
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.setAttribute('tabindex', active ? '0' : '-1');
    }
  }

  function enhancePlatformTabs(attempt) {
    var sidebar = document.querySelector('.dumi-default-sidebar');
    if (!sidebar) {
      if ((attempt || 0) < 40) {
        setTimeout(function () {
          enhancePlatformTabs((attempt || 0) + 1);
        }, 100);
      }
      return;
    }

    var tabs = sidebar.querySelector('.xmd-platform-tabs');
    if (!tabs) {
      var en = isEnglishPage();
      tabs = document.createElement('div');
      tabs.className = 'xmd-platform-tabs';
      tabs.setAttribute('role', 'tablist');
      tabs.setAttribute('aria-label', en ? 'Mini-program platform' : '小程序平台');
      tabs.innerHTML =
        '<button type="button" class="xmd-platform-tab" role="tab" data-platform="alipay">' +
        (en ? 'Alipay' : '支付宝') +
        '</button>' +
        '<button type="button" class="xmd-platform-tab" role="tab" data-platform="wechat">' +
        (en ? 'WeChat' : '微信') +
        '</button>';
      sidebar.insertBefore(tabs, sidebar.firstChild);

      tabs.addEventListener('click', function (ev) {
        var btn = ev.target.closest('.xmd-platform-tab');
        if (!btn) return;
        setDocPlatform(btn.getAttribute('data-platform'));
      });
      tabs.addEventListener('keydown', function (ev) {
        if (ev.key !== 'ArrowLeft' && ev.key !== 'ArrowRight') return;
        ev.preventDefault();
        var current = getDocPlatform();
        setDocPlatform(current === 'alipay' ? 'wechat' : 'alipay');
        var active = tabs.querySelector('[aria-selected="true"]');
        if (active) active.focus();
      });
    }

    syncPlatformTabs();
  }

  function syncSidebarLocale(attempt) {
    var sidebar = document.querySelector('.dumi-default-sidebar');
    if (!sidebar) {
      if ((attempt || 0) < 40) {
        setTimeout(function () {
          syncSidebarLocale((attempt || 0) + 1);
        }, 100);
      }
      return;
    }

    if (!isEnglishPage()) return;

    var linkMap = [
      ['Introduction', '/docs/introduce-en'],
      ['Code Examples', '/docs/code-examples-en'],
      ['Streaming Rendering', '/docs/streaming-en'],
      ['Component Usage', '/docs/components-en'],
      ['Code Highlight', '/docs/plugins-code-highlight-en'],
      ['Formula', '/docs/plugins-latex-en'],
      ['Custom Plugin', '/docs/plugins-custom-en'],
    ];
    var links = sidebar.querySelectorAll('dd > a[href]');
    for (var i = 0; i < links.length && i < linkMap.length; i++) {
      links[i].textContent = linkMap[i][0];
      links[i].setAttribute('href', linkMap[i][1]);
    }

    var titles = Array.prototype.filter.call(sidebar.querySelectorAll('dt'), function (dt) {
      return dt.textContent.trim();
    });
    if (titles[0]) titles[0].textContent = 'A Components';
    if (titles[1]) titles[1].textContent = 'B Plugins';
  }

  function normalizeSidebarActive(attempt) {
    var sidebar = document.querySelector('.dumi-default-sidebar');
    if (!sidebar) {
      if ((attempt || 0) < 40) {
        setTimeout(function () {
          normalizeSidebarActive((attempt || 0) + 1);
        }, 100);
      }
      return;
    }

    var currentPath = window.location.pathname.replace(/\/$/, '') || '/';
    var currentHash = window.location.hash;
    var links = sidebar.querySelectorAll('dd > a[href]');
    var best = null;

    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      link.classList.remove('active');
      try {
        var url = new URL(link.getAttribute('href'), window.location.origin);
        var linkPath = url.pathname.replace(/\/$/, '') || '/';
        if (linkPath !== currentPath) continue;
        if (currentHash) {
          if (url.hash === currentHash) best = link;
        } else if (!url.hash) {
          best = link;
        }
      } catch (_) {
        /* Ignore malformed hrefs from future sidebar extensions. */
      }
    }

    if (best) best.classList.add('active');
  }

  function flash(el) {
    var status = el.querySelector('[data-xmd-copy-status]');
    var normalText = status ? status.getAttribute('data-normal-text') || status.textContent : '';
    var successText = el.getAttribute('data-xmd-copy-success') || normalText;
    if (status && !status.getAttribute('data-normal-text')) {
      status.setAttribute('data-normal-text', normalText);
    }
    if (status) status.textContent = successText;
    el.setAttribute('data-copied', 'true');
    setTimeout(function () {
      el.removeAttribute('data-copied');
      if (status) status.textContent = status.getAttribute('data-normal-text') || normalText;
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

  /* ---- SPA navigation: avoid full-reload white flash on internal links ----
     Dumi uses @umijs/renderer-react's createBrowserHistory, which listens to
     popstate. Calling history.pushState() alone does not notify it, so we
     also dispatch a synthetic popstate event after pushing the new URL. */
  function isInternalHref(href) {
    if (!href) return false;
    if (href.charAt(0) === '#') return false;
    if (/^[a-z]+:/i.test(href) && !/^https?:/i.test(href)) return false;
    try {
      var url = new URL(href, window.location.origin);
      return url.origin === window.location.origin;
    } catch (e) {
      return false;
    }
  }

  function navigateSPA(href) {
    if (!href) return;
    var url = new URL(href, window.location.origin);
    closeInlineSearch();
    closeSearchModal();
    var samePath = url.pathname === window.location.pathname && url.search === window.location.search;
    if (samePath && url.hash) {
      window.location.hash = url.hash;
      return;
    }
    window.history.pushState({}, '', url.pathname + url.search + url.hash);
    window.dispatchEvent(new PopStateEvent('popstate'));
    if (url.hash) {
      // give react-router a tick to render the target route, then scroll to the anchor
      requestAnimationFrame(function () {
        var target = document.querySelector(url.hash);
        if (target) target.scrollIntoView({ block: 'start' });
      });
    } else {
      window.scrollTo({ top: 0 });
    }
  }

  function spaClickHandler(ev) {
    if (ev.defaultPrevented) return;
    if (ev.button !== 0) return;
    if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
    var a = ev.currentTarget;
    var href = a.getAttribute('href');
    if (!isInternalHref(href)) return;
    if (a.target && a.target !== '_self') return;
    ev.preventDefault();
    navigateSPA(href);
  }

  // Order of groups in the popover. Items inside a group keep the order
  // in which they're declared below.
  var SEARCH_GROUP_ORDER = ['入门', '指南', '平台', 'API', '其他'];

  var searchItems = [
    { title: '首页', link: '/', group: '入门', desc: '项目概览与核心特性', keywords: 'x-markdown-mini Markdown 小程序 渲染层 AI 流式内容' },
    { title: '在线体验', link: '/playground', group: '入门', desc: '浏览器中编辑 Markdown 并实时预览', keywords: 'Playground 微信 支付宝' },
    { title: '介绍', link: '/docs/introduce', group: '指南', desc: 'x-markdown-mini 的定位、特性、渲染链路与安装方式', keywords: '介绍 特性 安装 MiniNode marked 小程序' },
    { title: '代码示例', link: '/docs/code-examples', group: '指南', desc: 'renderNodes、实例化、组件接入、GFM 与换行示例', keywords: '示例 renderNodes XMarkdownMini Markdown 组件 GFM breaks' },
    { title: '流式渲染', link: '/docs/streaming', group: '指南', desc: '稳定块缓存、tail fixup、语义化分块与流式补全', keywords: 'streaming stableNodes liveTail 流式 补全 semantic fixup' },
    { title: '组件使用', link: '/docs/components', group: '组件', desc: 'Markdown 与 MiniNodeRenderer 组件的使用方法', keywords: '组件 Markdown MiniNodeRenderer components' },
    { title: '代码高亮', link: '/docs/plugins-code-highlight', group: '插件', desc: 'CodeHighlight 插件与 highlight.js 语言配置', keywords: '插件 代码高亮 CodeHighlight highlight.js' },
    { title: '公式', link: '/docs/plugins-latex', group: '插件', desc: 'Latex 插件、KaTeX 语法与样式引入', keywords: '插件 公式 Latex KaTeX 数学' },
    { title: '自定义插件', link: '/docs/plugins-custom', group: '插件', desc: '以脚注为例编写 XMarkdownExtension', keywords: '插件 自定义 extension footnote 脚注 tokenizer miniRenderer' },
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

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function scoreSearchItem(item, query) {
    if (!query) return 1;
    var title = item.title.toLowerCase();
    if (title === query) return 4;
    if (title.indexOf(query) >= 0) return 3;
    var haystack = (item.title + ' ' + item.desc + ' ' + (item.keywords || '')).toLowerCase();
    if (haystack.indexOf(query) >= 0) return 2;
    return 0;
  }

  function renderSearchResults(container, keyword) {
    var list = container.querySelector('.xmd-search-results');
    if (!list) return;
    var query = keyword.trim().toLowerCase();

    // Bucket matching items by group, keeping declaration order within
    // each group. ComponentOverview-style grouped display.
    var buckets = {};
    var matchedCount = 0;
    searchItems.forEach(function (item) {
      var score = scoreSearchItem(item, query);
      if (score === 0) return;
      if (!buckets[item.group]) buckets[item.group] = [];
      buckets[item.group].push({ item: item, score: score });
      matchedCount += 1;
    });

    if (matchedCount === 0) {
      list.innerHTML = '<div class="xmd-search-empty">未找到相关内容</div>';
      return;
    }

    var groupOrder = SEARCH_GROUP_ORDER.filter(function (g) {
      return buckets[g] && buckets[g].length;
    });
    // Append any group not in SEARCH_GROUP_ORDER (forward-compatible).
    Object.keys(buckets).forEach(function (g) {
      if (groupOrder.indexOf(g) === -1) groupOrder.push(g);
    });

    list.innerHTML = groupOrder
      .map(function (groupName) {
        var entries = buckets[groupName].slice().sort(function (a, b) {
          return b.score - a.score;
        });
        var items = entries
          .map(function (entry) {
            var item = entry.item;
            return (
              '<a class="xmd-search-result" href="' +
              item.link +
              '">' +
              '<span class="xmd-search-result-title">' +
              escapeHTML(item.title) +
              '</span>' +
              '<small class="xmd-search-result-desc">' +
              escapeHTML(item.desc) +
              '</small>' +
              '</a>'
            );
          })
          .join('');
        return (
          '<div class="xmd-search-group">' +
          '<div class="xmd-search-group-header">' +
          '<span class="xmd-search-group-title">' +
          escapeHTML(groupName) +
          '</span>' +
          '<span class="xmd-search-group-count">' +
          entries.length +
          '</span>' +
          '</div>' +
          '<div class="xmd-search-group-items">' +
          items +
          '</div>' +
          '</div>'
        );
      })
      .join('');

    // Wire SPA navigation so result clicks don't trigger a full page reload.
    var anchors = list.querySelectorAll('a.xmd-search-result');
    for (var i = 0; i < anchors.length; i++) {
      anchors[i].addEventListener('click', spaClickHandler);
    }
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

  /* ---- inline search expansion inside the capsule ---- */
  function getNavCluster() {
    return document.querySelector('.xmd-nav-cluster');
  }

  function canUseInlineSearch(cluster) {
    if (!cluster) return false;
    var style = window.getComputedStyle(cluster);
    return style.display !== 'none' && style.visibility !== 'hidden' && cluster.getBoundingClientRect().width > 0;
  }

  function openInlineSearch() {
    var cluster = getNavCluster();
    if (!canUseInlineSearch(cluster)) {
      openSearchModal();
      return;
    }
    cluster.setAttribute('data-search-state', 'open');
    var popover = cluster.querySelector('.xmd-search-popover');
    var input = cluster.querySelector('.xmd-search-inline input');
    if (popover) renderSearchResults(popover, input ? input.value : '');
    if (input) {
      // give the browser a tick so the transition can start before focus
      requestAnimationFrame(function () {
        input.focus();
        input.select();
      });
    }
  }

  function closeInlineSearch() {
    var cluster = getNavCluster();
    if (!cluster) return;
    if (cluster.getAttribute('data-search-state') !== 'open') return;
    cluster.removeAttribute('data-search-state');
    var input = cluster.querySelector('.xmd-search-inline input');
    if (input) {
      input.value = '';
      input.blur();
    }
  }

  function closeVersionDropdowns() {
    var menus = document.querySelectorAll('.xmd-version-dropdown[data-open="true"]');
    for (var i = 0; i < menus.length; i++) {
      var wrap = menus[i];
      var trigger = wrap.querySelector('.xmd-version-trigger');
      wrap.removeAttribute('data-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    }
  }

  function onDocClickForInline(ev) {
    var cluster = getNavCluster();
    if (cluster && cluster.getAttribute('data-search-state') === 'open' && !cluster.contains(ev.target)) {
      closeInlineSearch();
    }

    var version = ev.target.closest && ev.target.closest('.xmd-version-dropdown');
    if (!version) closeVersionDropdowns();
  }

  document.addEventListener('keydown', forceSearchModal, true);
  document.addEventListener('click', onSearchShortcutClick, true);
  document.addEventListener('click', onSearchModalClick, true);
  document.addEventListener('keydown', onSearchModalKeydown, true);
  document.addEventListener('click', onDocClickForInline, true);
  window.addEventListener('hashchange', function () {
    normalizeSidebarActive();
  });
  window.addEventListener('popstate', function () {
    setTimeout(normalizeSidebarActive, 0);
  });

  function setupDevDebug() {
    var params = new URLSearchParams(window.location.search);
    var isLocal =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '0.0.0.0';
    var debug = params.get('xmd-debug') === '1';

    if (isLocal) {
      document.body.setAttribute('data-xmd-dev', 'true');
    }

    if (isLocal && debug) {
      var badge = document.createElement('div');
      badge.className = 'xmd-dev-badge';
      badge.textContent = 'dev · layout debug on';
      document.body.appendChild(badge);
    }

    if (debug) {
      document.body.setAttribute('data-xmd-debug', 'true');
    }
  }

  function isEnglishPage() {
    return /-en(\/|$)/.test(window.location.pathname);
  }

  // Ant Design icon SVG paths — viewBox "64 64 896 896", same source as x's
  // RcFooter. Inlined to keep parity with x's rendered HTML.
  var ANT_ICONS = {
    'ant-design':
      '<svg viewBox="64 64 896 896" focusable="false" data-icon="ant-design" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M716.3 313.8c19-18.9 19-49.7 0-68.6l-69.9-69.9.1.1c-18.5-18.5-50.3-50.3-95.3-95.2-21.2-20.7-55.5-20.5-76.5.5L80.9 474.2a53.84 53.84 0 000 76.4L474.6 944a54.14 54.14 0 0076.5 0l165.1-165c19-18.9 19-49.7 0-68.6a48.7 48.7 0 00-68.7 0l-125 125.2c-5.2 5.2-13.3 5.2-18.5 0L189.5 521.4c-5.2-5.2-5.2-13.3 0-18.5l314.4-314.2c.4-.4.9-.7 1.3-1.1 5.2-4.1 12.4-3.7 17.2 1.1l125.2 125.1c19 19 49.8 19 68.7 0zM408.6 514.4a106.3 106.2 0 10212.6 0 106.3 106.2 0 10-212.6 0zm536.2-38.6L821.9 353.5c-19-18.9-49.8-18.9-68.7.1a48.4 48.4 0 000 68.6l83 82.9c5.2 5.2 5.2 13.3 0 18.5l-81.8 81.7a48.4 48.4 0 000 68.6 48.7 48.7 0 0068.7 0l121.8-121.7a53.93 53.93 0 00-.1-76.4z"/></svg>',
    medium:
      '<svg viewBox="64 64 896 896" focusable="false" data-icon="medium" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M834.7 279.8l61.3-58.9V208H683.7L532.4 586.4 360.3 208H137.7v12.9l71.6 86.6c7 6.4 10.6 15.8 9.7 25.2V673c2.2 12.3-1.7 24.8-10.3 33.7L128 805v12.7h228.6v-12.9l-80.6-98a39.99 39.99 0 01-11.1-33.7V378.7l200.7 439.2h23.3l172.6-439.2v349.9c0 9.2 0 11.1-6 17.2l-62.1 60.3V819h301.2v-12.9l-59.9-58.9c-5.2-4-7.9-10.7-6.8-17.2V297a18.1 18.1 0 016.8-17.2z"/></svg>',
    twitter:
      '<svg viewBox="64 64 896 896" focusable="false" data-icon="twitter" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M928 254.3c-30.6 13.2-63.9 22.7-98.2 26.4a170.1 170.1 0 0075-94 336.64 336.64 0 01-108.2 41.2A170.1 170.1 0 00672 174c-94.5 0-170.5 76.6-170.5 170.6 0 13.2 1.6 26.4 4.2 39.1-141.5-7.4-267.7-75-351.6-178.5a169.32 169.32 0 00-23.2 86.1c0 59.2 30.1 111.4 76 142.1a172 172 0 01-77.1-21.7v2.1c0 82.9 58.6 151.6 136.7 167.4a180.6 180.6 0 01-44.9 5.8c-11.1 0-21.6-1.1-32.2-2.6C211 652 273.9 701.1 348.8 702.7c-58.6 45.9-132 72.9-211.7 72.9-14.3 0-27.5-.5-41.2-2.1C171.5 822 261.2 850 357.8 850 671.4 850 843 590.2 843 364.7c0-7.4 0-14.8-.5-22.2 33.2-24.3 62.3-54.4 85.5-88.2z"/></svg>',
    zhihu:
      '<svg viewBox="64 64 896 896" focusable="false" data-icon="zhihu" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M564.7 230.1V803h60l25.2 71.4L756.3 803h131.5V230.1H564.7zm247.7 497h-59.9l-75.1 50.4-17.8-50.4h-18V308.3h170.7v418.8zM526.1 486.9H393.3c2.1-44.9 4.3-104.3 6.6-172.9h130.9l-.1-8.1c0-.6-.2-14.7-2.3-29.1-2.1-15-6.6-34.9-21-34.9H287.8c4.4-20.6 15.7-69.7 29.4-93.8l6.4-11.2-12.9-.7c-.8 0-19.6-.9-41.4 10.6-35.7 19-51.7 56.4-58.7 84.4-18.4 73.1-44.6 123.9-55.7 145.6-3.3 6.4-5.3 10.2-6.2 12.8-1.8 4.9-.8 9.8 2.8 13 10.5 9.5 38.2-2.9 38.5-3 .6-.3 1.3-.6 2.2-1 13.9-6.3 55.1-25 69.8-84.5h56.7c.7 32.2 3.1 138.4 2.9 172.9h-141l-2.1 1.5c-23.1 16.9-30.5 63.2-30.8 65.2l-1.4 9.2h167c-12.3 78.3-26.5 113.4-34 127.4-3.7 7-7.3 14-10.7 20.8-21.3 42.2-43.4 85.8-126.3 153.6-3.6 2.8-7 8-4.8 13.7 2.4 6.3 9.3 9.1 24.6 9.1 5.4 0 11.8-.3 19.4-1 49.9-4.4 100.8-18 135.1-87.6 17-35.1 31.7-71.7 43.9-108.9L497 850l5-12c.8-1.9 19-46.3 5.1-95.9l-.5-1.8-108.1-123-22 16.6c6.4-26.1 10.6-49.9 12.5-71.1h158.7v-8c0-40.1-18.5-63.9-19.2-64.9l-2.4-3z"/></svg>',
    'usergroup-add':
      '<svg viewBox="64 64 896 896" focusable="false" data-icon="usergroup-add" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M892 772h-80v-80c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v80h-80c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h80v80c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-80h80c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM373.5 498.4c-.9-8.7-1.4-17.5-1.4-26.4 0-15.9 1.5-31.4 4.3-46.5.7-3.6-1.2-7.3-4.5-8.8-13.6-6.1-26.1-14.5-36.9-25.1a127.54 127.54 0 01-38.7-95.4c.9-32.1 13.8-62.6 36.3-85.6 24.7-25.3 57.9-39.1 93.2-38.7 31.9.3 62.7 12.6 86 34.4 7.9 7.4 14.7 15.6 20.4 24.4 2 3.1 5.9 4.4 9.3 3.2 17.6-6.1 36.2-10.4 55.3-12.4 5.6-.6 8.8-6.6 6.3-11.6-32.5-64.3-98.9-108.7-175.7-109.9-110.8-1.7-203.2 89.2-203.2 200 0 62.8 28.9 118.8 74.2 155.5-31.8 14.7-61.1 35-86.5 60.4-54.8 54.7-85.8 126.9-87.8 204a8 8 0 008 8.2h56.1c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5 29.4-29.4 65.4-49.8 104.7-59.7 3.8-1.1 6.4-4.8 5.9-8.8zM824 472c0-109.4-87.9-198.3-196.9-200C516.3 270.3 424 361.2 424 472c0 62.8 29 118.8 74.2 155.5a300.95 300.95 0 00-86.4 60.4C357 742.6 326 814.8 324 891.8a8 8 0 008 8.2h56c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5C505.8 695.7 563 672 624 672c110.4 0 200-89.5 200-200zm-109.5 90.5C690.3 586.7 658.2 600 624 600s-66.3-13.3-90.5-37.5a127.26 127.26 0 01-37.5-91.8c.3-32.8 13.4-64.5 36.3-88 24-24.6 56.1-38.3 90.4-38.7 33.9-.3 66.8 12.9 91 36.6 24.8 24.3 38.4 56.8 38.4 91.4-.1 34.2-13.4 66.3-37.6 90.5z"/></svg>',
    github:
      '<svg viewBox="64 64 896 896" focusable="false" data-icon="github" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0138.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z"/></svg>',
    history:
      '<svg viewBox="64 64 896 896" focusable="false" data-icon="history" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M536.1 273H488c-4.4 0-8 3.6-8 8v275.3c0 2.6 1.2 5 3.3 6.5l165.3 120.7c3.6 2.6 8.6 1.9 11.2-1.7l28.6-39c2.7-3.7 1.9-8.7-1.7-11.2L544.1 528.5V281c0-4.4-3.6-8-8-8zm219.8 75.2l156.8 38.3c5 1.2 9.9-2.6 9.9-7.7l.8-161.5c0-6.7-7.7-10.5-12.9-6.3L752.9 334.1a8 8 0 003 14.1zm167.7 301.1l-56.7-19.5a8 8 0 00-10.1 4.8c-1.9 5.1-3.9 10.1-6 15.1-17.8 42.1-43.3 80-75.9 112.5a353 353 0 01-112.5 75.9 352.18 352.18 0 01-137.7 27.8c-47.8 0-94.1-9.3-137.7-27.8a353 353 0 01-112.5-75.9c-32.5-32.5-58-70.4-75.9-112.5A353.44 353.44 0 01171 512c0-47.8 9.3-94.2 27.8-137.8 17.8-42.1 43.3-80 75.9-112.5a353 353 0 01112.5-75.9C430.6 167.3 477 158 524.8 158s94.1 9.3 137.7 27.8A353 353 0 01775 261.7c10.2 10.3 19.8 21 28.6 32.3l59.8-46.8C784.7 146.6 662.2 81.9 524.6 82 285 82.1 92.6 276.7 95 516.4 97.4 751.9 288.9 942 524.8 942c185.5 0 343.5-117.6 403.7-282.3 1.5-4.2-.7-8.9-4.9-10.4z"/></svg>',
    'question-circle':
      '<svg viewBox="64 64 896 896" focusable="false" data-icon="question-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"/><path d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0130.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1080 0 40 40 0 10-80 0z"/></svg>',
    bug: '<svg viewBox="64 64 896 896" focusable="false" data-icon="bug" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M304 280h56c4.4 0 8-3.6 8-8 0-28.3 5.9-53.2 17.1-73.5 10.6-19.4 26-34.8 45.4-45.4C450.9 142 475.7 136 504 136h16c28.3 0 53.2 5.9 73.5 17.1 19.4 10.6 34.8 26 45.4 45.4C650 218.9 656 243.7 656 272c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8 0-40-8.8-76.7-25.9-108.1a184.31 184.31 0 00-74-74C596.7 72.8 560 64 520 64h-16c-40 0-76.7 8.8-108.1 25.9a184.31 184.31 0 00-74 74C304.8 195.3 296 232 296 272c0 4.4 3.6 8 8 8z"/><path d="M940 512H792V412c76.8 0 139-62.2 139-139 0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8a63 63 0 01-63 63H232a63 63 0 01-63-63c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 76.8 62.2 139 139 139v100H84c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h148v96c0 6.5.2 13 .7 19.3C164.1 728.6 116 796.7 116 876c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8 0-44.2 23.9-82.9 59.6-103.7a273 273 0 0022.7 49c24.3 41.5 59 76.2 100.5 100.5S460.5 960 512 960s99.8-13.9 141.3-38.2a281.38 281.38 0 00123.2-149.5A120 120 0 01836 876c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8 0-79.3-48.1-147.4-116.7-176.7.4-6.4.7-12.8.7-19.3v-96h148c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM716 680c0 36.8-9.7 72-27.8 102.9-17.7 30.3-43 55.6-73.3 73.3C584 874.3 548.8 884 512 884s-72-9.7-102.9-27.8c-30.3-17.7-55.6-43-73.3-73.3A202.75 202.75 0 01308 680V412h408v268z"/></svg>',
    'issues-close':
      '<svg viewBox="64 64 896 896" focusable="false" data-icon="issues-close" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M464 688a48 48 0 1096 0 48 48 0 10-96 0zm72-112c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48zm400-188h-59.3c-2.6 0-5 1.2-6.5 3.3L763.7 538.1l-49.9-68.8a7.92 7.92 0 00-6.5-3.3H648c-6.5 0-10.3 7.4-6.5 12.7l109.2 150.7a16.1 16.1 0 0026 0l165.8-228.7c3.8-5.3 0-12.7-6.5-12.7zm-44 306h-64.2c-5.5 0-10.6 2.9-13.6 7.5a352.2 352.2 0 01-49.8 62.2A355.92 355.92 0 01651.1 840a355 355 0 01-138.7 27.9c-48.1 0-94.8-9.4-138.7-27.9a355.92 355.92 0 01-113.3-76.3A353.06 353.06 0 01184 650.5c-18.6-43.8-28-90.5-28-138.5s9.4-94.7 28-138.5c17.9-42.4 43.6-80.5 76.4-113.2 32.8-32.7 70.9-58.4 113.3-76.3a355 355 0 01138.7-27.9c48.1 0 94.8 9.4 138.7 27.9 42.4 17.9 80.5 43.6 113.3 76.3 19 19 35.6 39.8 49.8 62.2 2.9 4.7 8.1 7.5 13.6 7.5H892c6 0 9.8-6.3 7.2-11.6C828.8 178.5 684.7 82 517.7 80 278.9 77.2 80.5 272.5 80 511.2 79.5 750.1 273.3 944 512.4 944c169.2 0 315.6-97 386.7-238.4A8 8 0 00892 694z"/></svg>',
    message:
      '<svg viewBox="64 64 896 896" focusable="false" data-icon="message" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M464 512a48 48 0 1096 0 48 48 0 10-96 0zm200 0a48 48 0 1096 0 48 48 0 10-96 0zm-400 0a48 48 0 1096 0 48 48 0 10-96 0zm661.2-173.6c-22.6-53.7-55-101.9-96.3-143.3a444.35 444.35 0 00-143.3-96.3C630.6 75.7 572.2 64 512 64h-2c-60.6.3-119.3 12.3-174.5 35.9a445.35 445.35 0 00-142 96.5c-40.9 41.3-73 89.3-95.2 142.8-23 55.4-34.6 114.3-34.3 174.9A449.4 449.4 0 00112 714v152a46 46 0 0046 46h152.1A449.4 449.4 0 00510 960h2.1c59.9 0 118-11.6 172.7-34.3a444.48 444.48 0 00142.8-95.2c41.3-40.9 73.8-88.7 96.5-142 23.6-55.2 35.6-113.9 35.9-174.5.3-60.9-11.5-120-34.8-175.6zm-151.1 438C704 845.8 611 884 512 884h-1.7c-60.3-.3-120.2-15.3-173.1-43.5l-8.4-4.5H188V695.2l-4.5-8.4C155.3 633.9 140.3 574 140 513.7c-.4-99.7 37.7-193.3 107.6-263.8 69.8-70.5 163.1-109.5 262.8-109.9h1.7c50 0 98.5 9.7 144.2 28.9 44.6 18.7 84.6 45.6 119 80 34.3 34.3 61.3 74.4 80 119 19.4 46.2 29.1 95.2 28.9 145.8-.6 99.6-39.7 192.9-110.1 262.7z"/></svg>',
    'bg-colors':
      '<svg viewBox="64 64 896 896" focusable="false" data-icon="bg-colors" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M766.4 744.3c43.7 0 79.4-36.2 79.4-80.5 0-53.5-79.4-140.8-79.4-140.8S687 610.3 687 663.8c0 44.3 35.7 80.5 79.4 80.5zm-377.1-44.1c7.1 7.1 18.6 7.1 25.6 0l256.1-256c7.1-7.1 7.1-18.6 0-25.6l-256-256c-.6-.6-1.3-1.2-2-1.7l-78.2-78.2a9.11 9.11 0 00-12.8 0l-48 48a9.11 9.11 0 000 12.8l67.2 67.2-207.8 207.9c-7.1 7.1-7.1 18.6 0 25.6l255.9 256zm12.9-448.6l178.9 178.9H223.4l178.8-178.9zM904 816H120c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8z"/></svg>',
  };

  function antIcon(name, style) {
    var svg = ANT_ICONS[name];
    if (!svg) return '';
    var styleAttr = style ? ' style="' + style + '"' : '';
    return (
      '<span role="img" aria-label="' + name + '" class="anticon anticon-' + name + '"' + styleAttr + '>' +
      svg +
      '</span>'
    );
  }

  function imgIcon(src, alt, size) {
    var s = size || 16;
    return '<img width="' + s + '" height="' + s + '" alt="' + alt + '" src="' + src + '" />';
  }

  function getFooterColumns() {
    var isZh = !isEnglishPage();
    var t = isZh
      ? {
          resources: '相关资源',
          community: '社区',
          help: '帮助',
          moreProducts: '更多产品',
          chinaMirror: '国内镜像站点 🇨🇳',
          landingDesc: '首页模板集',
          scaffoldsDesc: '脚手架市场',
          umiDesc: 'React 应用开发框架',
          dumiDesc: '组件/文档研发工具',
          qiankunDesc: '微前端框架',
          motionDesc: '设计动效',
          awesome: 'Awesome Ant Design',
          yuqueColumn: 'Ant Design 语雀专栏',
          zhihuColumn: 'Ant Design 知乎专栏',
          zhihuXTech: '体验科技专栏',
          seeconf: 'SEE Conf',
          seeconfDesc: '蚂蚁体验科技大会',
          joinUs: '加入我们',
          changelog: '更新日志',
          faq: '常见问题',
          bugReport: '报告 Bug',
          issues: '议题',
          discussions: '讨论区',
          yuqueSlogan: '构建你的数字花园',
          antvSlogan: '数据可视化解决方案',
          eggSlogan: '企业级 Node.js 框架',
          galaceanSlogan: '互动图形解决方案',
          kitchenSlogan: 'Sketch 工具集',
          xtech: '蚂蚁体验科技',
          themeEditor: '主题编辑器',
        }
      : {
          resources: 'Resources',
          community: 'Community',
          help: 'Help',
          moreProducts: 'More Products',
          chinaMirror: 'China Mirror 🇨🇳',
          landingDesc: 'Landing Templates',
          scaffoldsDesc: 'Scaffold Market',
          umiDesc: 'React Application Framework',
          dumiDesc: 'Component doc generator',
          qiankunDesc: 'Micro-Frontends Framework',
          motionDesc: 'Motion Solution',
          awesome: 'Awesome Ant Design',
          yuqueColumn: 'Ant Design on YuQue',
          zhihuColumn: 'Ant Design on Zhihu',
          zhihuXTech: 'XTech on Zhihu',
          seeconf: 'SEE Conf',
          seeconfDesc: 'The Experience Tech Conference of Ant Group',
          joinUs: 'Work with Us',
          changelog: 'Change Log',
          faq: 'FAQ',
          bugReport: 'Bug Report',
          issues: 'Issues',
          discussions: 'Discussions',
          yuqueSlogan: 'Document Collaboration Platform',
          antvSlogan: 'Data Visualization',
          eggSlogan: 'Enterprise Node.js Framework',
          galaceanSlogan: 'Interactive Graphics',
          kitchenSlogan: 'Sketch Toolkit',
          xtech: 'Ant XTech',
          themeEditor: 'Theme Editor',
        };

    // Image-based icons live on Ant Design's CDN. We reuse them verbatim so
    // the rendered footer matches x.ant.design's HTML.
    var imgs = {
      yuque: 'https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg',
      seeconf: 'https://gw.alipayobjects.com/zos/rmsportal/mZBWtboYbnMkTBaRIuWQ.png',
      xtech: 'https://gw.alipayobjects.com/zos/rmsportal/nBVXkrFdWHxbZlmMbsaH.svg',
      antv: 'https://gw.alipayobjects.com/zos/antfincdn/nc7Fc0XBg5/8a6844f5-a6ed-4630-9177-4fa5d0b7dd47.png',
      egg: 'https://www.eggjs.org/logo.svg',
      kitchen: 'https://gw.alipayobjects.com/zos/rmsportal/DMDOlAUhmktLyEODCMBR.ico',
      galacean:
        'https://mdn.alipayobjects.com/huamei_j9rjmc/afts/img/A*3ittT5OEo2gAAAAAAAAAAAAADvGmAQ/original',
    };

    var col1 = {
      title: t.resources,
      items: [
        {
          title: 'Ant Design',
          url: isZh ? 'https://ant-design.antgroup.com/index-cn' : 'https://ant.design',
        },
        {
          title: 'Ant Design Charts',
          url: isZh ? 'https://ant-design-charts.antgroup.com' : 'https://charts.ant.design',
        },
        { title: 'Ant Design Pro', url: 'https://pro.ant.design' },
        {
          title: 'Pro Components',
          url: isZh ? 'https://pro-components.antdigital.dev' : 'https://procomponents.ant.design',
        },
        {
          title: 'Ant Design Mobile',
          url: isZh ? 'https://ant-design-mobile.antgroup.com/zh' : 'https://mobile.ant.design',
        },
        {
          title: 'Ant Design Mini',
          url: isZh ? 'https://ant-design-mini.antgroup.com/' : 'https://mini.ant.design',
        },
        {
          title: 'Ant Design Web3',
          url: isZh ? 'https://web3.antdigital.dev' : 'https://web3.ant.design',
        },
        { title: 'Ant Design Landing', url: 'https://landing.ant.design', description: t.landingDesc },
        { title: 'Scaffolds', url: 'https://scaffold.ant.design', description: t.scaffoldsDesc },
        { title: 'Umi', url: 'https://umijs.org', description: t.umiDesc },
        { title: 'dumi', url: 'https://d.umijs.org', description: t.dumiDesc },
        { title: 'qiankun', url: 'https://qiankun.umijs.org', description: t.qiankunDesc },
        { title: 'Ant Motion', url: 'https://motion.ant.design', description: t.motionDesc },
        {
          title: t.chinaMirror,
          url: 'https://ant-design.antgroup.com',
          internal: true,
        },
      ],
    };

    var col2 = {
      title: t.community,
      items: [
        { iconHtml: antIcon('ant-design'), title: t.awesome, url: 'https://github.com/websemantics/awesome-ant-design' },
        { iconHtml: antIcon('medium'), title: 'Medium', url: 'http://medium.com/ant-design/' },
        {
          iconHtml: antIcon('twitter', 'color: rgb(29, 161, 242)'),
          title: 'Twitter',
          url: 'http://twitter.com/antdesignui',
        },
        {
          iconHtml: imgIcon(imgs.yuque, 'yuque logo'),
          title: t.yuqueColumn,
          url: 'https://yuque.com/ant-design/ant-design',
        },
        {
          iconHtml: antIcon('zhihu', 'color: rgb(5, 109, 232)'),
          title: t.zhihuColumn,
          url: 'https://www.zhihu.com/column/c_1564262000561106944',
        },
        {
          iconHtml: antIcon('zhihu', 'color: rgb(5, 109, 232)'),
          title: t.zhihuXTech,
          url: 'https://www.zhihu.com/column/c_1543658574504751104',
        },
        {
          iconHtml: imgIcon(imgs.seeconf, 'seeconf logo'),
          title: t.seeconf,
          description: t.seeconfDesc,
          url: 'https://seeconf.antfin.com/',
        },
      ],
    };

    if (isZh) {
      col2.items.push({
        iconHtml: antIcon('usergroup-add'),
        title: t.joinUs,
        url: '/docs/resources-cn#加入我们',
        internal: true,
      });
    }

    var col3 = {
      title: t.help,
      items: [
        {
          iconHtml: antIcon('github'),
          title: 'GitHub',
          url: 'https://github.com/ant-design/x-markdown-mini',
        },
        {
          iconHtml: antIcon('history'),
          title: t.changelog,
          url: isZh ? '/docs/changelog' : '/docs/changelog-en',
          internal: true,
        },
        {
          iconHtml: antIcon('question-circle'),
          title: t.faq,
          url: isZh ? '/docs/quickstart' : '/docs/quickstart-en',
          internal: true,
        },
        {
          iconHtml: antIcon('bug'),
          title: t.bugReport,
          url: 'https://github.com/ant-design/x-markdown-mini/issues/new',
        },
        {
          iconHtml: antIcon('issues-close'),
          title: t.issues,
          url: 'https://github.com/ant-design/x-markdown-mini/issues',
        },
        {
          iconHtml: antIcon('message'),
          title: t.discussions,
          url: 'https://github.com/ant-design/x-markdown-mini/discussions',
        },
        {
          iconHtml: antIcon('question-circle'),
          title: 'StackOverflow',
          url: 'http://stackoverflow.com/questions/tagged/antd',
        },
        {
          iconHtml: antIcon('question-circle'),
          title: 'SegmentFault',
          url: 'https://segmentfault.com/t/antd',
        },
      ],
    };

    var col4 = {
      titleIconHtml: imgIcon(imgs.xtech, 'Ant XTech logo', 22),
      title: t.moreProducts,
      items: [
        { iconHtml: imgIcon(imgs.yuque, 'yuque logo'), title: '语雀', url: 'https://yuque.com', description: t.yuqueSlogan },
        { iconHtml: imgIcon(imgs.antv, 'AntV logo'), title: 'AntV', url: 'https://antv.antgroup.com', description: t.antvSlogan },
        { iconHtml: imgIcon(imgs.egg, 'Egg logo'), title: 'Egg', url: 'https://eggjs.org', description: t.eggSlogan },
        { iconHtml: imgIcon(imgs.kitchen, 'Kitchen logo'), title: 'Kitchen', url: 'https://kitchen.alipay.com', description: t.kitchenSlogan },
        { iconHtml: imgIcon(imgs.galacean, 'Galacean logo'), title: 'Galacean', url: 'https://galacean.antgroup.com/', description: t.galaceanSlogan },
        { iconHtml: imgIcon(imgs.xtech, 'xtech logo'), title: t.xtech, url: 'https://xtech.antfin.com/' },
        { iconHtml: antIcon('bg-colors'), title: t.themeEditor, url: isZh ? '/theme-editor-cn' : '/theme-editor', internal: true },
      ],
    };

    return [col1, col2, col3, col4];
  }

  function renderFooterItem(item) {
    var isExternal = !item.internal && /^https?:\/\//.test(item.url);
    var extAttrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    var iconHtml = item.iconHtml
      ? '<span class="rc-footer-item-icon">' + item.iconHtml + '</span>'
      : '';
    var descParts = '';
    if (item.description) {
      descParts =
        '<span class="rc-footer-item-separator">-</span>' +
        '<span class="rc-footer-item-description">' + item.description + '</span>';
    }
    return (
      '<div class="rc-footer-item">' +
      '<a href="' + item.url + '"' + extAttrs + '>' +
      iconHtml +
      item.title +
      '</a>' +
      descParts +
      '</div>'
    );
  }

  function enhanceFooter() {
    if (document.querySelector('.xmd-site-footer')) return;

    var defaultFooter = document.querySelector('.dumi-default-footer');
    var isZh = !isEnglishPage();
    var owner = isZh ? '蚂蚁集团和 Ant Design 开源社区' : 'Ant Group and Ant Design Community';

    var footer = document.createElement('footer');
    footer.className = 'xmd-site-footer rc-footer';
    footer.innerHTML =
      '<section class="rc-footer-container">' +
      '<section class="rc-footer-columns">' +
      getFooterColumns()
        .map(function (col) {
          var titleIconHtml = col.titleIconHtml
            ? '<span class="rc-footer-column-icon">' + col.titleIconHtml + '</span>'
            : '';
          return (
            '<div class="rc-footer-column">' +
            '<h2>' + titleIconHtml + col.title + '</h2>' +
            col.items.map(renderFooterItem).join('') +
            '</div>'
          );
        })
        .join('') +
      '</section>' +
      '</section>' +
      '<section class="rc-footer-bottom">' +
      '<div class="rc-footer-bottom-container">' +
      '<div style="opacity:0.4">Made with <span class="xmd-site-footer-heart">❤</span> by</div>' +
      '<div>' + owner + '</div>' +
      '</div>' +
      '</section>';

    if (defaultFooter && defaultFooter.parentNode) {
      defaultFooter.parentNode.replaceChild(footer, defaultFooter);
    } else {
      document.body.appendChild(footer);
    }
  }

  var SEARCH_ICON_SVG =
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>';

  var GITHUB_ICON_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .11-.78.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.92 0-1.3.47-2.37 1.24-3.21-.13-.3-.54-1.52.11-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.21 0 4.6-2.82 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.83.58A12 12 0 0 0 12 .5z"/></svg>';

  // Repo + version registry. Add older versions here when published, mapping
  // a version label to the URL serving that version's docs. The current build
  // is always the default; entries listed here become extra dropdown options.
  var GITHUB_URL = 'https://github.com/ant-design/x-markdown-mini';
  var CURRENT_VERSION = '1.0.0';
  var VERSION_MIRRORS = {
    // '1.x': 'https://1x-x-markdown-mini.example.com',
  };

  function isEnPathname(pathname) {
    return /-en(\/|$)/.test(pathname);
  }

  function getNavLinks() {
    var en = isEnPathname(window.location.pathname);
    return en
      ? [
          { label: 'Playground', href: '/playground-en' },
          { label: 'Docs', href: '/docs/introduce-en' },
        ]
      : [
          { label: '在线演示', href: '/playground' },
          { label: '文档', href: '/docs/introduce' },
        ];
  }

  function isActiveHref(href) {
    var path = window.location.pathname.replace(/\/$/, '');
    var target = href.replace(/\/$/, '');
    if (!target) return path === '';
    return path === target || path.indexOf(target + '/') === 0;
  }

  function buildLangSwitch() {
    var en = isEnPathname(window.location.pathname);
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'xmd-lang-switch';
    btn.setAttribute('aria-label', en ? 'Switch language to Chinese' : '切换语言到英文');
    btn.title = en ? 'English / 中文' : '中文 / English';

    var inner = document.createElement('span');
    inner.className = 'xmd-lang-inner';
    // When en is active, "En" is the primary (filled), "中" is secondary (outline).
    var primary = document.createElement('span');
    primary.className = 'xmd-lang-label xmd-lang-primary';
    primary.textContent = en ? 'En' : '中';
    var secondary = document.createElement('span');
    secondary.className = 'xmd-lang-label xmd-lang-secondary';
    secondary.textContent = en ? '中' : 'En';
    inner.appendChild(primary);
    inner.appendChild(secondary);
    btn.appendChild(inner);

    btn.addEventListener('click', function (ev) {
      ev.preventDefault();
      var path = window.location.pathname;
      var search = window.location.search;
      var hash = window.location.hash;
      var nextPath;
      if (en) {
        // strip "-en" suffix from path segments
        nextPath = path.replace(/-en(?=\/|$)/g, '') || '/';
      } else {
        // append "-en" suffix to each path segment that doesn't already end in -en
        if (path === '/' || path === '') {
          nextPath = '/-en';
        } else {
          nextPath = path.replace(/\/$/, '') + '-en';
        }
      }
      try {
        if (window.localStorage) {
          window.localStorage.setItem('xmd-doc-locale', en ? 'zh-CN' : 'en-US');
        }
      } catch (_) {
        /* localStorage may be blocked */
      }
      window.location.href = nextPath + search + hash;
    });

    return btn;
  }

  function buildVersionSelect() {
    var isEn = isEnPathname(window.location.pathname);
    var wrap = document.createElement('span');
    wrap.className = 'xmd-version-dropdown';

    var options = {};
    options[CURRENT_VERSION] = '';
    Object.keys(VERSION_MIRRORS).forEach(function (label) {
      options[label] = VERSION_MIRRORS[label];
    });

    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'xmd-version-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-label', isEn ? 'Version' : '版本');
    trigger.innerHTML =
      '<span class="xmd-version-label">v' +
      CURRENT_VERSION +
      '</span>' +
      '<span class="xmd-version-arrow" aria-hidden="true"></span>';

    var menu = document.createElement('div');
    menu.className = 'xmd-version-menu';
    menu.setAttribute('role', 'listbox');
    menu.setAttribute('aria-label', isEn ? 'Version' : '版本');

    Object.keys(options).forEach(function (label) {
      var item = document.createElement('button');
      item.type = 'button';
      item.className = 'xmd-version-option';
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', label === CURRENT_VERSION ? 'true' : 'false');
      item.dataset.url = options[label];
      item.innerHTML =
        '<span>v' +
        label +
        '</span>' +
        (label === CURRENT_VERSION ? '<span class="xmd-version-check" aria-hidden="true">✓</span>' : '');
      item.addEventListener('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        var url = item.dataset.url;
        closeVersionDropdowns();
        if (url) window.location.href = url;
      });
      menu.appendChild(item);
    });

    trigger.addEventListener('click', function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      var open = wrap.getAttribute('data-open') === 'true';
      closeInlineSearch();
      closeVersionDropdowns();
      if (!open) {
        wrap.setAttribute('data-open', 'true');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    trigger.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') {
        closeVersionDropdowns();
        trigger.focus();
      }
      if (ev.key === 'ArrowDown' || ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        wrap.setAttribute('data-open', 'true');
        trigger.setAttribute('aria-expanded', 'true');
        var active = menu.querySelector('[aria-selected="true"]') || menu.querySelector('.xmd-version-option');
        if (active) active.focus();
      }
    });

    menu.addEventListener('keydown', function (ev) {
      var items = Array.prototype.slice.call(menu.querySelectorAll('.xmd-version-option'));
      var idx = items.indexOf(document.activeElement);
      if (ev.key === 'Escape') {
        closeVersionDropdowns();
        trigger.focus();
      } else if (ev.key === 'ArrowDown' && items.length) {
        ev.preventDefault();
        items[(idx + 1 + items.length) % items.length].focus();
      } else if (ev.key === 'ArrowUp' && items.length) {
        ev.preventDefault();
        items[(idx - 1 + items.length) % items.length].focus();
      }
    });

    wrap.appendChild(trigger);
    wrap.appendChild(menu);
    return wrap;
  }

  function buildGithubLink() {
    var a = document.createElement('a');
    a.className = 'xmd-pill-btn xmd-github-link';
    a.href = GITHUB_URL;
    a.target = '_blank';
    a.rel = 'noreferrer noopener';
    a.title = 'GitHub';
    a.setAttribute('aria-label', 'GitHub');
    a.innerHTML = GITHUB_ICON_SVG;
    return a;
  }

  function enhanceHeader(attempt) {
    var headerRight = document.querySelector('.dumi-default-header-right');

    if (!headerRight) {
      if ((attempt || 0) < 40) {
        setTimeout(function () {
          enhanceHeader((attempt || 0) + 1);
        }, 100);
      }
      return;
    }

    // Build the centered capsule with: search-icon | divider | nav links
    var cluster = headerRight.querySelector('.xmd-nav-cluster');
    if (!cluster) {
      cluster = document.createElement('div');
      cluster.className = 'xmd-nav-cluster';
      headerRight.insertBefore(cluster, headerRight.firstChild);
    }

    var links = getNavLinks();
    var linkSig = links
      .map(function (l) {
        return l.href + '|' + (isActiveHref(l.href) ? '1' : '0');
      })
      .join(',');
    if (cluster.getAttribute('data-sig') !== linkSig) {
      cluster.setAttribute('data-sig', linkSig);
      cluster.removeAttribute('data-search-state');
      cluster.innerHTML = '';

      var isEn = isEnPathname(window.location.pathname);

      // Shell wraps the search trigger + the expanding input + the popover.
      // Matches the x repo pattern (.dumi/theme/slots/Header/SearchBar.tsx):
      // button and input are flex siblings; nav links stay outside and visible.
      var searchShell = document.createElement('div');
      searchShell.className = 'xmd-search-shell';

      var searchBtn = document.createElement('button');
      searchBtn.type = 'button';
      searchBtn.className = 'xmd-search-trigger';
      searchBtn.setAttribute('aria-label', isEn ? 'Search' : '搜索');
      var shortcutLabel = /(mac|iphone|ipod|ipad)/i.test(navigator.platform || '') ? '⌘K' : 'Ctrl K';
      searchBtn.innerHTML =
        '<svg class="xmd-search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">' +
        '<circle cx="9" cy="9" r="5.75" stroke="currentColor" stroke-width="1.7"/>' +
        '<path d="m13.4 13.4 3.35 3.35" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>' +
        '</svg>' +
        '<span class="xmd-search-trigger-label">' +
        (isEn ? 'Search...' : '搜索...') +
        '</span>' +
        '<kbd aria-hidden="true">' +
        shortcutLabel +
        '</kbd>';
      searchBtn.addEventListener('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        openSearchModal();
      });
      searchShell.appendChild(searchBtn);

      var searchInline = document.createElement('div');
      searchInline.className = 'xmd-search-inline';
      var placeholder = isEn ? 'Search docs…' : '搜索文档…';
      searchInline.innerHTML =
        '<svg class="xmd-search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">' +
        '<circle cx="9" cy="9" r="5.75" stroke="currentColor" stroke-width="1.7"/>' +
        '<path d="m13.4 13.4 3.35 3.35" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>' +
        '</svg>';
      var input = document.createElement('input');
      input.type = 'search';
      input.autocomplete = 'off';
      input.placeholder = placeholder;
      input.setAttribute('aria-label', placeholder);
      var escKbd = document.createElement('kbd');
      escKbd.textContent = 'Esc';
      escKbd.setAttribute('aria-label', isEn ? 'Close search' : '关闭搜索');
      escKbd.addEventListener('click', function (ev) {
        ev.preventDefault();
        closeInlineSearch();
      });
      searchInline.appendChild(input);
      searchInline.appendChild(escKbd);
      searchShell.appendChild(searchInline);

      var popover = document.createElement('div');
      popover.className = 'xmd-search-popover';
      popover.innerHTML = '<div class="xmd-search-results"></div>';
      searchShell.appendChild(popover);

      cluster.appendChild(searchShell);

      input.addEventListener('input', function () {
        renderSearchResults(popover, input.value);
      });
      input.addEventListener('keydown', function (ev) {
        if (ev.key === 'Escape') {
          ev.preventDefault();
          closeInlineSearch();
        }
      });
      // Collapse when focus leaves the wrapper (mirrors x's onBlur logic).
      searchInline.addEventListener('focusout', function () {
        setTimeout(function () {
          if (!searchShell.contains(document.activeElement)) {
            closeInlineSearch();
          }
        }, 150);
      });

      links.forEach(function (link) {
        var a = document.createElement('a');
        a.className = 'xmd-nav-link' + (isActiveHref(link.href) ? ' active' : '');
        a.href = link.href;
        a.textContent = link.label;
        a.addEventListener('click', spaClickHandler);
        cluster.appendChild(a);
      });
    }

    // Build the right pill: version select | divider | lang switch | github
    var support = headerRight.querySelector('.xmd-header-support');
    if (!support) {
      support = document.createElement('div');
      support.className = 'xmd-header-support';
      headerRight.appendChild(support);
    }

    var supportSig = (isEnPathname(window.location.pathname) ? 'en' : 'zh') + '|' + CURRENT_VERSION;
    if (support.getAttribute('data-sig') !== supportSig) {
      support.setAttribute('data-sig', supportSig);
      support.innerHTML = '';
      support.appendChild(buildVersionSelect());
      support.appendChild(buildLangSwitch());
      support.appendChild(buildGithubLink());
    }
  }

  function enhanceHeroLinks() {
    // Enhance every internal link on the landing page (hero + sections + CTA)
    // for SPA navigation, not just the hero. The query keeps `.xmd-hero` in the
    // selector so the homepage-detection contract still resolves.
    var heroLinks = document.querySelectorAll('.xmd-landing a[href], .xmd-hero a[href]');
    for (var i = 0; i < heroLinks.length; i++) {
      var a = heroLinks[i];
      if (a.__xmdSpa) continue;
      a.__xmdSpa = true;
      a.addEventListener('click', spaClickHandler);
    }
  }

  /* ---- Table copy button -------------------------------------------------
     dumi wraps every markdown table in `.dumi-default-table-content`. We inject
     a hover-reveal copy button that serializes the table to tab-separated text
     (one row per line) so it pastes cleanly into Excel / sheets. */
  function tableToTSV(table) {
    var rows = table.querySelectorAll('tr');
    var lines = [];
    for (var r = 0; r < rows.length; r++) {
      var cells = rows[r].querySelectorAll('th, td');
      var cols = [];
      for (var c = 0; c < cells.length; c++) {
        cols.push((cells[c].textContent || '').trim().replace(/\s+/g, ' '));
      }
      lines.push(cols.join('\t'));
    }
    return lines.join('\n');
  }

  function enhanceTables() {
    var wraps = document.querySelectorAll('.markdown .dumi-default-table-content');
    for (var i = 0; i < wraps.length; i++) {
      var wrap = wraps[i];
      if (wrap.getAttribute('data-xmd-table-copy') === 'true') continue;
      var table = wrap.querySelector('table');
      if (!table) continue;
      wrap.setAttribute('data-xmd-table-copy', 'true');

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'xmd-table-copy';
      btn.setAttribute('aria-label', isEnglishPage() ? 'Copy table' : '复制表格');
      btn.innerHTML =
        '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">' +
        '<path d="M5 5.5c0-.83.67-1.5 1.5-1.5h6c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5h-6c-.83 0-1.5-.67-1.5-1.5v-6Z" stroke="currentColor" stroke-width="1.4"/>' +
        '<path d="M3 10H2.5C1.67 10 1 9.33 1 8.5v-6C1 1.67 1.67 1 2.5 1h6C9.33 1 10 1.67 10 2.5V3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' +
        '</svg>';

      (function (tbl, button) {
        button.addEventListener('click', function () {
          copyText(tableToTSV(tbl))
            .then(function () {
              button.setAttribute('data-copied', 'true');
              setTimeout(function () {
                button.removeAttribute('data-copied');
              }, 1400);
            })
            .catch(function () {
              /* Clipboard can be blocked in embedded browsers. */
            });
        });
      })(table, btn);

      wrap.appendChild(btn);
    }
  }

  function bootstrap() {
    setupDevDebug();
    initPlatformAttribute();
    enhancePlatformTabs();
    syncSidebarLocale();
    normalizeSidebarActive();
    enhanceHeader();
    enhanceFooter();
    enhanceHeroLinks();
    enhanceTables();
  }

  // Expose so the scroll-shrink IIFE's MutationObserver can re-run it on route changes.
  window.__xmdEnhanceHeader = enhanceHeader;
  window.__xmdEnhanceFooter = enhanceFooter;
  window.__xmdEnhanceHeroLinks = enhanceHeroLinks;
  window.__xmdEnhancePlatformTabs = enhancePlatformTabs;
  window.__xmdSyncSidebarLocale = syncSidebarLocale;
  window.__xmdNormalizeSidebarActive = normalizeSidebarActive;
  window.__xmdEnhanceTables = enhanceTables;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();

(function () {
  if (typeof window === 'undefined') return;

  function init(attempt) {
    var header = document.querySelector('.dumi-default-header');
    if (!header) {
      if ((attempt || 0) < 40) {
        setTimeout(function () {
          init((attempt || 0) + 1);
        }, 100);
      } else {
        console.warn('xmd-hero: .dumi-default-header not found; scroll-shrink disabled');
      }
      return;
    }
    if (header.getAttribute('data-xmd-scroll-bound') === 'true') return;
    header.setAttribute('data-xmd-scroll-bound', 'true');

    var ticking = false;
    function update() {
      ticking = false;
      var hero = document.querySelector('.xmd-hero');
      var hasHero = !!hero;
      if (!hasHero) {
        document.body.classList.remove('xmd-homepage', 'xmd-over-hero');
        header.classList.toggle('xmd-mini', window.scrollY > 8);
        return;
      }
      document.body.classList.add('xmd-homepage');
      var heroBottom = hero.getBoundingClientRect().bottom;
      var isOverHero = heroBottom > header.offsetHeight + 12;
      var shouldShrink = window.scrollY > 8;
      document.body.classList.toggle('xmd-over-hero', isOverHero);
      header.classList.toggle('xmd-mini', shouldShrink);
    }
    function requestUpdate() {
      if (ticking) return;
      requestAnimationFrame(update);
      ticking = true;
    }
    window.addEventListener(
      'scroll',
      requestUpdate,
      { passive: true },
    );
    window.addEventListener('resize', requestUpdate, { passive: true });
    new MutationObserver(function () {
      if (typeof window.__xmdEnhanceHeader === 'function') window.__xmdEnhanceHeader();
      if (typeof window.__xmdEnhanceFooter === 'function') window.__xmdEnhanceFooter();
      if (typeof window.__xmdEnhanceHeroLinks === 'function') window.__xmdEnhanceHeroLinks();
      if (typeof window.__xmdEnhancePlatformTabs === 'function') window.__xmdEnhancePlatformTabs();
      if (typeof window.__xmdSyncSidebarLocale === 'function') window.__xmdSyncSidebarLocale();
      if (typeof window.__xmdNormalizeSidebarActive === 'function') window.__xmdNormalizeSidebarActive();
      if (typeof window.__xmdEnhanceTables === 'function') window.__xmdEnhanceTables();
      if (typeof window.__xmdBindHeroGlow === 'function') window.__xmdBindHeroGlow();
      requestUpdate();
    }).observe(document.body, { childList: true, subtree: true });
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ---------------------------------------------------------------------------
 * Hero pointer glow — the aurora spotlight (.xmd-hero::before) follows the
 * cursor by writing --xmd-mx / --xmd-my (percentages) onto the hero element.
 * Skipped for coarse pointers (touch) and prefers-reduced-motion; in those
 * cases the CSS defaults keep the glow gently off-centre and static. Coalesced
 * with requestAnimationFrame so pointermove never thrashes layout.
 * ------------------------------------------------------------------------- */
(function () {
  if (typeof window === 'undefined') return;

  function motionOK() {
    if (typeof window.matchMedia !== 'function') return true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    // Only track a precise pointer; touch devices get the static default glow.
    return window.matchMedia('(pointer: fine)').matches;
  }

  var boundHero = null;
  var raf = 0;
  var pendingX = 0;
  var pendingY = 0;

  function apply() {
    raf = 0;
    if (!boundHero) return;
    // Pixels relative to the hero's top-left. The CSS ::before box is inflated
    // 360px on every side and offsets the gradient by the same 360px, so the
    // glow's soft edge always finishes inside the box (no rectangular clip).
    boundHero.style.setProperty('--xmd-mx', Math.round(pendingX) + 'px');
    boundHero.style.setProperty('--xmd-my', Math.round(pendingY) + 'px');
  }

  function onMove(e) {
    if (!boundHero) return;
    var rect = boundHero.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    pendingX = e.clientX - rect.left;
    pendingY = e.clientY - rect.top;
    if (!raf) raf = requestAnimationFrame(apply);
  }

  function onLeave() {
    // Drop the overrides so the CSS % defaults take over — a gentle off-centre
    // resting glow rather than a snap.
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
    if (boundHero) {
      boundHero.style.removeProperty('--xmd-mx');
      boundHero.style.removeProperty('--xmd-my');
    }
  }

  function bind() {
    var hero = document.querySelector('.xmd-hero');
    if (hero === boundHero) return;
    if (boundHero) {
      boundHero.removeEventListener('pointermove', onMove);
      boundHero.removeEventListener('pointerleave', onLeave);
      boundHero = null;
    }
    if (!hero || !motionOK()) return;
    boundHero = hero;
    hero.addEventListener('pointermove', onMove, { passive: true });
    hero.addEventListener('pointerleave', onLeave, { passive: true });
  }

  window.__xmdBindHeroGlow = bind;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();

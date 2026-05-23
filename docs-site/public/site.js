(function () {
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupDevDebug);
  } else {
    setupDevDebug();
  }
})();

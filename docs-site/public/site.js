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
    copyText(text).then(function () {
      flash(el);
    });
  }

  document.addEventListener('click', onClick, true);
})();

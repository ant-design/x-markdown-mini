// towxml exposes the same `app.towxml(content, lang)` entry on Alipay as it
// does on WeChat. Loaded once at launch so the bench page just calls it.
// marked is required directly inside the page (not here) since only the
// rich-text baseline needs it.
const towxml = require('towxml');

App({
  towxml,
});

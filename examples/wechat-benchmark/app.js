// towxml is loaded once at app launch and exposed as `app.towxml(content, lang)`
// per its standard install pattern. Other libraries (x-markdown-mini, mp-html)
// are imported by the page directly as components.
const towxml = require('towxml');

App({
  towxml,
});

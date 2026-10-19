/*! Pach Bot v1.0 - drop-in chat widget. One <script> tag, no dependencies. */
(function () {
  if (window.__pachBotLoaded) return;
  window.__pachBotLoaded = true;

  var tag = document.currentScript || document.querySelector('script[src*="pach-bot"]');
  var d = (tag && tag.dataset) || {};
  var cfg = {
    name: d.name || 'Pach Bot',
    color: d.color || '#4f46e5',
    greeting: d.greeting || 'Hi! I\'m Pach Bot. Ask me anything.',
    position: d.position === 'left' ? 'left' : 'right',
    endpoint: d.endpoint || '',   // optional: POST {message} -> {reply}
    faqUrl: d.faq || ''           // optional: URL to JSON [{k:["word"],a:"answer"}]
  };

  var faq = [
    { k: ['hi', 'hello', 'hey'], a: 'Hello! How can I help you today?' },
    { k: ['contact', 'email', 'support', 'help'], a: 'You can reach us through the contact page on this site.' },
    { k: ['price', 'pricing', 'cost', 'plan'], a: 'Check the pricing page for the latest plans.' },
    { k: ['hours', 'open', 'time'], a: 'We\'re online 24/7, and the team replies during business hours.' }
  ];

  if (cfg.faqUrl) {
    fetch(cfg.faqUrl).then(function (r) { return r.json(); })
      .then(function (j) { if (Array.isArray(j)) faq = j; })
      .catch(function () {});
  }

  var host = document.createElement('div');
  host.id = 'pach-bot-host';
  document.body.appendChild(host);
  var root = host.attachShadow({ mode: 'open' });
  var side = cfg.position;

  root.innerHTML =
    '<style>' +
    ':host{all:initial}' +
    '*{box-sizing:border-box;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}' +
    '.fab{position:fixed;bottom:20px;' + side + ':20px;width:56px;height:56px;border-radius:50%;border:0;background:' + cfg.color + ';color:#fff;font-size:26px;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.25);z-index:2147483646}' +
    '.panel{position:fixed;bottom:88px;' + side + ':20px;width:340px;max-width:calc(100vw - 24px);height:460px;max-height:calc(100vh - 110px);background:#fff;color:#111;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.28);display:none;flex-direction:column;overflow:hidden;z-index:2147483647}' +
    '.panel.open{display:flex}' +
    '.head{background:' + cfg.color + ';color:#fff;padding:14px 16px;font-weight:600;display:flex;justify-content:space-between;align-items:center}' +
    '.x{background:none;border:0;color:#fff;font-size:20px;cursor:pointer}' +
    '.msgs{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;background:#f6f7f9}' +
    '.m{max-width:80%;padding:9px 12px;border-radius:14px;font-size:14px;line-height:1.4;white-space:pre-wrap;word-wrap:break-word}' +
    '.bot{background:#fff;align-self:flex-start;border:1px solid #e5e7eb}' +
    '.me{background:' + cfg.color + ';color:#fff;align-self:flex-end}' +
    '.row{display:flex;border-top:1px solid #e5e7eb}' +
    'input{flex:1;border:0;padding:14px;font-size:14px;outline:none;background:#fff;color:#111}' +
    '.send{border:0;background:none;color:' + cfg.color + ';font-weight:600;padding:0 16px;cursor:pointer}' +
    '@media(prefers-color-scheme:dark){.panel{background:#1b1d21;color:#eee}.msgs{background:#14161a}.bot{background:#23262b;border-color:#2f3339;color:#eee}input{background:#1b1d21;color:#eee}.row{border-color:#2f3339}}' +
    '</style>' +
    '<button class="fab" aria-label="Open chat">\uD83D\uDCAC</button>' +
    '<div class="panel" role="dialog" aria-label="Chat"><div class="head"><span></span><button class="x" aria-label="Close">\u00D7</button></div>' +
    '<div class="msgs"></div><div class="row"><input placeholder="Type a message..." aria-label="Message"><button class="send">Send</button></div></div>';

  var $ = function (s) { return root.querySelector(s); };
  var fab = $('.fab'), panel = $('.panel'), msgs = $('.msgs'), input = $('input');
  $('.head span').textContent = cfg.name;

  function add(text, who) {
    var el = document.createElement('div');
    el.className = 'm ' + who;
    el.textContent = text;
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function localReply(text) {
    var words = text.toLowerCase().split(/\W+/), best = null, bestScore = 0;
    faq.forEach(function (f) {
      var score = 0;
      (f.k || []).forEach(function (k) { if (words.indexOf(String(k).toLowerCase()) > -1) score++; });
      if (score > bestScore) { bestScore = score; best = f; }
    });
    return best ? best.a : 'Sorry, I don\'t know that one yet. Try asking about contact, pricing or hours.';
  }

  function reply(text) {
    if (!cfg.endpoint) return add(localReply(text), 'bot');
    fetch(cfg.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, page: location.href })
    }).then(function (r) { return r.json(); })
      .then(function (j) { add(j.reply || '...', 'bot'); })
      .catch(function () { add('Connection problem. Please try again.', 'bot'); });
  }

  function send() {
    var t = input.value.trim();
    if (!t) return;
    input.value = '';
    add(t, 'me');
    setTimeout(function () { reply(t); }, 250);
  }

  fab.onclick = function () {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
      if (!msgs.children.length) add(cfg.greeting, 'bot');
      input.focus();
    }
  };
  $('.x').onclick = function () { panel.classList.remove('open'); };
  $('.send').onclick = send;
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });
})();

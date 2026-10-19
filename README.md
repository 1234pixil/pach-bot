# Pach Bot

A drop-in chat widget for any website. No dependencies, one file.

## Install
1. Upload `pach-bot.js` to your site or CDN.
2. Paste this before `</body>` on any page:

    <script src="https://YOUR-SITE.com/pach-bot.js" defer></script>

## Options (data attributes)
- `data-name`      Bot title (default "Pach Bot")
- `data-color`     Hex colour (default #4f46e5)
- `data-greeting`  First message
- `data-position`  `right` (default) or `left`
- `data-faq`       URL of a JSON file of answers (see faq.example.json)
- `data-endpoint`  Your own API: receives POST {message, page}, returns {reply}.
                   Use this to connect a real AI or support backend.

Without `data-endpoint`, the bot answers from keyword matching in the FAQ list.
Test locally by opening `index.html`.

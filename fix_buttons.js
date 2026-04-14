const fs = require('fs');
let c = fs.readFileSync('outreach-dashboard/public/index.html', 'utf8');
// Fix all buttons missing </button> - they end with just >
let fixed = 0;
// Pattern: <button ...>TEXT without </button>
// Fix: add </button> to all unclosed buttons
// The pattern to find: button elements that end with </button> vs those that don't
// Check how many <button vs </button>
const btnOpen = (c.match(/<button/g)||[]).length;
const btnClose = (c.match(/<\/button>/g)||[]).length;
console.log('Open buttons:', btnOpen, 'Close buttons:', btnClose, 'Diff:', btnOpen - btnClose);
// Fix by adding </button> to buttons that are self-closing-ish
// Pattern: <button onclick="...">SYMBOL followed by </div> or whitespace but NOT </button>
// The broken pattern: <button onclick="collapsePanel(this)">−</button>
// Wait - check actual content
const btns = c.match(/<button[^>]*>[^<]+/g);
if (btns) {
  btns.forEach((b,i) => {
    const hasClose = b.includes('</button>');
    if (!hasClose) {
      const fn = b.match(/onclick="([^"]+)"/)?.[1] || '';
      const txt = b.replace(/<button[^>]*>/, '').trim();
      const replacement = `<button onclick="${fn}">${txt}</button>`;
      c = c.replace(b, replacement);
      fixed++;
    }
  });
}
console.log('Fixed:', fixed);
fs.writeFileSync('outreach-dashboard/public/index.html', c, 'utf8');
console.log('Done. New size:', c.length);

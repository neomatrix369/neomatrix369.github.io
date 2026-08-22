(function () {
  const LATEST = '2026-08-22T0830Z-which-models-extracted-playground.html';
  const m = location.pathname.match(/(\d{4}-\d{2}-\d{2}T\d{4}Z)-which-models-extracted-playground\.html$/);
  const stamp = m ? m[1] : null;
  if (!stamp) return;

  const style = document.createElement('style');
  style.textContent = `
    #pg-snapshot-chrome {
      position: sticky; top: 0; z-index: 9999;
      display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem 1rem;
      padding: 0.45rem 0.85rem;
      font: 500 12px/1.4 "IBM Plex Sans", system-ui, sans-serif;
      color: #5c564c; background: #f5f2ea;
      border-bottom: 1px solid rgba(28,25,21,.14);
    }
    #pg-snapshot-chrome a { color: #7a5c2e; text-decoration: none; }
    #pg-snapshot-chrome a:hover { text-decoration: underline; }
    #pg-snapshot-chrome .stamp {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 11px; color: #6b645a;
    }
    #pg-snapshot-chrome .sep { color: rgba(28,25,21,.25); }
    #pg-snapshot-chrome .latest { color: #7a5c2e; font-weight: 600; }
  `;
  document.head.appendChild(style);

  const bar = document.createElement('nav');
  bar.id = 'pg-snapshot-chrome';
  bar.setAttribute('aria-label', 'Playground archive');
  const latestMark = stamp === '2026-08-22T0830Z' ? ' <span class="latest">(latest)</span>' : '';
  bar.innerHTML = [
    '<a href="index.html">All snapshots</a>',
    '<span class="sep">·</span>',
    '<a href="../../pages/playgroup-202602-docextract.html">Project findings</a>',
    '<span class="sep">·</span>',
    '<a href="' + LATEST + '">Latest</a>',
    '<span class="sep">·</span>',
    '<span class="stamp">Viewing ' + stamp + latestMark + '</span>',
  ].join('');
  document.body.insertBefore(bar, document.body.firstChild);
})();

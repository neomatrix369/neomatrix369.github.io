(function () {
  const ARCHIVE = 'index.html';
  const LATEST = '2026-08-22T0830Z-which-models-extracted-playground.html';
  const path = location.pathname;

  if (new URLSearchParams(location.search).get('embed') === '1') {
    return;
  }

  if (/\/playgroup-202602-docextract\/index\.html$/.test(path)) {
    return;
  }
  if (/\/playgroup-202602-docextract\/?$/.test(path)) {
    return;
  }
  if (path.includes('2100Z-which-models-extracted-playground')) {
    return;
  }

  const stampMatch = path.match(/(\d{4}-\d{2}-\d{2}T\d{4}Z)-which-models-extracted-playground\.html$/);
  const isGuide = /extractor-all-doubleword\.html$/.test(path);
  if (!stampMatch && !isGuide) return;

  const style = document.createElement('style');
  style.textContent = `
    #pg-archive-chrome {
      position: sticky; top: 0; z-index: 99999;
      display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem 0.85rem;
      padding: 0.5rem 0.9rem;
      font: 500 12px/1.4 "IBM Plex Sans", system-ui, sans-serif;
      color: #5c564c; background: #f5f2ea;
      border-bottom: 1px solid rgba(28,25,21,.16);
      box-shadow: 0 1px 3px rgba(28,25,21,.06);
    }
    #pg-archive-chrome a { color: #7a5c2e; text-decoration: none; }
    #pg-archive-chrome a:hover { text-decoration: underline; }
    #pg-archive-chrome .pg-back {
      display: inline-flex; align-items: center; gap: 0.35rem;
      padding: 0.35rem 0.7rem;
      border: 1px solid rgba(28,25,21,.18);
      border-radius: 6px;
      background: #efe9dc;
      color: #1c1915 !important;
      font-weight: 600;
      text-decoration: none !important;
    }
    #pg-archive-chrome .pg-back:hover { background: #e7dfd0; }
    #pg-archive-chrome .stamp {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 11px; color: #6b645a;
    }
    #pg-archive-chrome .sep { color: rgba(28,25,21,.25); }
    #pg-archive-chrome .latest { color: #7a5c2e; font-weight: 600; }
  `;
  document.head.appendChild(style);

  const bar = document.createElement('nav');
  bar.id = 'pg-archive-chrome';
  bar.setAttribute('aria-label', 'Playground archive navigation');

  const parts = [
    '<a class="pg-back" href="' + ARCHIVE + '">← Playground archive</a>',
  ];

  if (stampMatch) {
    const stamp = stampMatch[1];
    const latestMark = stamp === '2026-08-22T0830Z' ? ' <span class="latest">(latest)</span>' : '';
    parts.push(
      '<span class="sep">·</span>',
      '<a href="' + LATEST + '">Latest snapshot</a>',
      '<span class="sep">·</span>',
      '<a href="../../pages/playgroup-202602-docextract.html">Project findings</a>',
      '<span class="sep">·</span>',
      '<span class="stamp">' + stamp + latestMark + '</span>'
    );
  } else if (isGuide) {
    parts.push(
      '<span class="sep">·</span>',
      '<span class="stamp">Doubleword extraction guide</span>',
      '<span class="sep">·</span>',
      '<a href="../../pages/playgroup-202602-docextract.html">Project findings</a>'
    );
  }

  bar.innerHTML = parts.join('');
  document.body.insertBefore(bar, document.body.firstChild);
})();

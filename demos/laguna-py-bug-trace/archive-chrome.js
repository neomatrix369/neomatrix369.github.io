(function () {
  const ARCHIVE = 'index.html';
  const PROJECT = '../../pages/laguna-py-bug-trace.html';
  const EXPLORER = 'explorer.html';
  const HF = window.LAGUNA_HF || {};

  const path = location.pathname;
  if (/\/laguna-py-bug-trace\/index\.html$/.test(path) || /\/laguna-py-bug-trace\/?$/.test(path)) {
    return;
  }

  const embed = new URLSearchParams(location.search).get('embed') === '1';
  if (embed) {
    const embedStyle = document.createElement('style');
    embedStyle.textContent = `
      .site-header, .site-footer { display: none !important; }
      .site-main { padding-top: 0.5rem; }
      body { margin: 0; }
    `;
    document.head.appendChild(embedStyle);
    return;
  }

  const script = document.currentScript;
  const sourceKey = script && script.getAttribute('data-source');
  const sourceUrl = sourceKey && HF.artifacts && HF.artifacts[sourceKey] ? HF.artifacts[sourceKey] : HF.reportsGuide;
  const sourceLabel = script && script.getAttribute('data-source-label');
  const pageTitle = script && script.getAttribute('data-page-title');
  const isExplorer = /\/explorer\.html$/.test(path);

  const style = document.createElement('style');
  style.textContent = `
    #laguna-archive-chrome {
      position: sticky; top: 0; z-index: 99999;
      display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem 0.85rem;
      padding: 0.5rem 0.9rem;
      font: 500 12px/1.4 "IBM Plex Sans", system-ui, sans-serif;
      color: #5c564c; background: #f5f2ea;
      border-bottom: 1px solid rgba(28,25,21,.16);
      box-shadow: 0 1px 3px rgba(28,25,21,.06);
    }
    #laguna-archive-chrome a { color: #7a5c2e; text-decoration: none; }
    #laguna-archive-chrome a:hover { text-decoration: underline; }
    #laguna-archive-chrome .pg-back {
      display: inline-flex; align-items: center; gap: 0.35rem;
      padding: 0.35rem 0.7rem;
      border: 1px solid rgba(28,25,21,.18);
      border-radius: 6px;
      background: #efe9dc;
      color: #1c1915 !important;
      font-weight: 600;
      text-decoration: none !important;
    }
    #laguna-archive-chrome .pg-back:hover { background: #e7dfd0; }
    #laguna-archive-chrome .stamp {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 11px; color: #6b645a;
    }
    #laguna-archive-chrome .sep { color: rgba(28,25,21,.25); }
    #laguna-archive-chrome .featured { color: #7a5c2e; font-weight: 600; }
    #laguna-hf-credit {
      margin: 1.5rem 0 0;
      padding: 0.85rem 1rem;
      border: 1px solid rgba(28,25,21,.12);
      border-radius: 6px;
      background: #efe9dc;
      font-size: 0.8125rem;
      color: #5c564c;
      line-height: 1.5;
    }
    #laguna-hf-credit a { color: #7a5c2e; }
    #laguna-hf-credit strong { color: #1c1915; }
    body.laguna-report-open .site-header { display: none; }
  `;
  document.head.appendChild(style);
  document.body.classList.add('laguna-report-open');

  const bar = document.createElement('nav');
  bar.id = 'laguna-archive-chrome';
  bar.setAttribute('aria-label', 'Laguna py-bug-trace reports');

  const parts = [
    '<a class="pg-back" href="' + ARCHIVE + '">← Reports archive</a>',
  ];

  if (isExplorer) {
    parts.push(
      '<span class="sep">·</span>',
      '<a href="' + EXPLORER + '">Primary explorer</a>',
      '<span class="sep">·</span>',
      '<a href="' + PROJECT + '">Project findings</a>'
    );
    if (sourceLabel) {
      parts.push('<span class="sep">·</span>', '<span class="stamp">' + sourceLabel + '</span>');
    }
  } else {
    parts.push(
      '<span class="sep">·</span>',
      '<a href="' + EXPLORER + '">Interactive explorer</a>',
      '<span class="sep">·</span>',
      '<a href="' + PROJECT + '">Project findings</a>'
    );
    if (pageTitle) {
      parts.push('<span class="sep">·</span>', '<span class="stamp">' + pageTitle + '</span>');
    } else if (sourceLabel) {
      parts.push('<span class="sep">·</span>', '<span class="stamp">' + sourceLabel + '</span>');
    }
  }

  if (HF.reportsGuide) {
    parts.push(
      '<span class="sep">·</span>',
      '<a href="' + HF.reportsGuide + '" rel="noopener" target="_blank">HF source</a>'
    );
  }

  bar.innerHTML = parts.join('');
  document.body.insertBefore(bar, document.body.firstChild);

  function injectCredit() {
    if (!HF.repo || document.getElementById('laguna-hf-credit')) return;
    const footer = document.querySelector('.site-footer') || document.body;
    const credit = document.createElement('aside');
    credit.id = 'laguna-hf-credit';
    credit.setAttribute('aria-label', 'Source attribution');
    credit.innerHTML =
      '<strong>Source &amp; license.</strong> Artifacts are mirrored from the ' +
      '<a href="' + HF.repo + '" rel="noopener" target="_blank">poolside-laguna-hackathon/laguna-eval-experiments</a> ' +
      'dataset on Hugging Face (py-bug-trace environment).' +
      (sourceUrl
        ? ' Canonical copy of this page: <a href="' + sourceUrl + '" rel="noopener" target="_blank">view on Hugging Face</a>.'
        : '') +
      (HF.reportsGuide
        ? ' Reports guide: <a href="' + HF.reportsGuide + '" rel="noopener" target="_blank">reports/README.md</a>.'
        : '');
    if (footer.classList && footer.classList.contains('site-footer')) {
      footer.parentNode.insertBefore(credit, footer);
    } else {
      document.body.appendChild(credit);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectCredit);
  } else {
    injectCredit();
  }
})();

/**
 * First-visit ASCII intro — decrypt/boot flash for an AI/ML engineer identity
 * (credentials, RAG/NLP systems, evaluation, craft). Not Matrix-themed.
 * Self-contained. Replay: ?ascii-intro=1  ·  hold: ?ascii-intro=hold
 */
(function () {
  const STORAGE_KEY = "nm369_ascii_intro_seen";
  const PLAY_MS = 3400;
  const FORCE_PLAY_MS = 7000;
  const FADE_MS = 750;
  const LINE_MS = 240;
  const DECRYPT_MS = 900;

  const SCRAMBLE =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789<>{}[]|/\\_+*#";

  // Blend: AI/ML engineer impact + profile/repos including Tripwire & rag-params-finder.
  const BOOT_LINES = [
    "> AI / ML engineer · certified · production systems",
    "> RAG / LLMs · rag-params-finder · RagCheck · evaluation",
    "> tripwire · security & quality scanning · NLP",
    "> java champion · 4× kaggle expert · software craftsperson",
    "> awesome-ai-ml-dl · 1.7k★ · speaker · mentor · open source",
  ];

  const TITLE_TARGET = "mani · neomatrix369";
  const FOOTER_LINE = "graalvm · extraction benchmarks · building in public · UK";

  function introMode() {
    try {
      return new URLSearchParams(location.search).get("ascii-intro");
    } catch (_e) {
      return null;
    }
  }

  function alreadySeen() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch (_e) {
      return false;
    }
  }

  function markSeen() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch (_e) {
      /* private mode — still show once this load */
    }
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function randomChar() {
    return SCRAMBLE.charAt((Math.random() * SCRAMBLE.length) | 0);
  }

  const mode = introMode();
  const force = mode === "1" || mode === "hold";
  const hold = mode === "hold";
  const playMs = force ? FORCE_PLAY_MS : PLAY_MS;

  if (!force && (alreadySeen() || prefersReducedMotion())) {
    return;
  }

  if (!force) {
    markSeen();
  }

  const style = document.createElement("style");
  style.id = "nm-ascii-intro-style";
  style.textContent = `
    #nm-ascii-intro {
      position: fixed;
      inset: 0;
      z-index: 200000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.25rem;
      background:
        radial-gradient(ellipse 80% 60% at 50% 40%, #efe9dc 0%, #f5f2ea 55%, #e7dfd0 100%);
      color: #1c1915;
      cursor: pointer;
      opacity: 1;
      transition: opacity ${FADE_MS}ms ease;
    }
    #nm-ascii-intro.nm-ascii-intro--out {
      opacity: 0;
      pointer-events: none;
    }
    #nm-ascii-intro-panel {
      position: relative;
      z-index: 1;
      width: min(42rem, 94vw);
      padding: 1.35rem 1.5rem 1.2rem;
      background: rgba(245, 242, 234, 0.92);
      border: 1px solid rgba(28, 25, 21, 0.18);
      border-radius: 6px;
      box-shadow: 0 1px 2px rgba(28, 25, 21, 0.06), 0 12px 32px rgba(28, 25, 21, 0.08);
      font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
    }
    #nm-ascii-intro-boot {
      margin: 0 0 1rem;
      min-height: 6.8em;
      font-size: clamp(0.65rem, 1.85vw, 0.78rem);
      line-height: 1.55;
      color: #5c564c;
      white-space: pre-wrap;
    }
    #nm-ascii-intro-boot .nm-line-done {
      color: #7a5c2e;
    }
    #nm-ascii-intro-title {
      margin: 0 0 0.55rem;
      font-size: clamp(1.15rem, 4vw, 1.65rem);
      font-weight: 500;
      letter-spacing: 0.02em;
      line-height: 1.25;
      color: #1c1915;
      min-height: 1.3em;
    }
    #nm-ascii-intro-title .nm-signal {
      color: #0e7490;
    }
    #nm-ascii-intro-footer {
      margin: 0;
      font-size: 0.7rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #6b645a;
      opacity: 0;
      transition: opacity 280ms ease;
    }
    #nm-ascii-intro-footer.nm-visible {
      opacity: 1;
    }
    #nm-ascii-intro-skip {
      position: absolute;
      right: 1rem;
      bottom: 1rem;
      z-index: 2;
      margin: 0;
      padding: 0.35rem 0.65rem;
      border: 1px solid rgba(28, 25, 21, 0.18);
      border-radius: 4px;
      background: rgba(245, 242, 234, 0.9);
      color: #6b645a;
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 0.7rem;
      letter-spacing: 0.04em;
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.id = "nm-ascii-intro";
  overlay.setAttribute("role", "presentation");
  overlay.setAttribute("aria-hidden", "true");

  const panel = document.createElement("div");
  panel.id = "nm-ascii-intro-panel";

  const boot = document.createElement("pre");
  boot.id = "nm-ascii-intro-boot";

  const title = document.createElement("p");
  title.id = "nm-ascii-intro-title";
  title.textContent = "";

  const footer = document.createElement("p");
  footer.id = "nm-ascii-intro-footer";
  footer.textContent = FOOTER_LINE;

  const skip = document.createElement("p");
  skip.id = "nm-ascii-intro-skip";
  skip.textContent = hold ? "click / esc to close" : "click / esc to skip";

  panel.appendChild(boot);
  panel.appendChild(title);
  panel.appendChild(footer);
  overlay.appendChild(panel);
  overlay.appendChild(skip);

  let dismissed = false;
  let fadeTimer = 0;
  let endTimer = 0;
  let lineTimer = 0;
  let rafId = 0;
  let bootIndex = 0;
  const revealedLines = [];

  function renderBoot() {
    boot.innerHTML = revealedLines
      .map((line, i) => {
        const cls = i < revealedLines.length - 1 || bootIndex >= BOOT_LINES.length
          ? ' class="nm-line-done"'
          : "";
        return `<span${cls}>${line}</span>`;
      })
      .join("\n");
  }

  function revealNextLine() {
    if (dismissed || bootIndex >= BOOT_LINES.length) {
      startDecrypt();
      return;
    }
    revealedLines.push(BOOT_LINES[bootIndex]);
    bootIndex += 1;
    renderBoot();
    lineTimer = window.setTimeout(revealNextLine, LINE_MS);
  }

  function formatTitle(raw) {
    // Keep " · " as signal-colored separator once decrypted.
    const parts = raw.split(" · ");
    if (parts.length !== 2 || raw !== TITLE_TARGET) {
      return raw.replace(/</g, "&lt;");
    }
    return `${parts[0]} <span class="nm-signal">·</span> ${parts[1]}`;
  }

  function startDecrypt() {
    const start = performance.now();
    const target = TITLE_TARGET;
    const locked = new Array(target.length).fill(false);

    function tick(now) {
      if (dismissed) {
        return;
      }
      const t = Math.min(1, (now - start) / DECRYPT_MS);
      // Lock characters from left to right as progress advances.
      const lockUpTo = Math.floor(t * target.length);
      for (let i = 0; i < lockUpTo; i += 1) {
        locked[i] = true;
      }

      let out = "";
      for (let i = 0; i < target.length; i += 1) {
        const ch = target.charAt(i);
        if (ch === " " || ch === "·") {
          out += ch;
          locked[i] = true;
          continue;
        }
        out += locked[i] ? ch : randomChar();
      }

      if (t >= 1) {
        title.innerHTML = formatTitle(TITLE_TARGET);
        footer.classList.add("nm-visible");
        renderBoot();
        if (!hold) {
          endTimer = window.setTimeout(dismiss, Math.max(400, playMs - (BOOT_LINES.length * LINE_MS + DECRYPT_MS)));
        }
        return;
      }

      title.textContent = out;
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
  }

  function cleanup() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    window.clearTimeout(fadeTimer);
    window.clearTimeout(endTimer);
    window.clearTimeout(lineTimer);
    window.removeEventListener("keydown", onKey);
    overlay.removeEventListener("click", dismiss);
    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
    if (style.parentNode) {
      style.parentNode.removeChild(style);
    }
  }

  function dismiss() {
    if (dismissed) {
      return;
    }
    dismissed = true;
    overlay.classList.add("nm-ascii-intro--out");
    fadeTimer = window.setTimeout(cleanup, FADE_MS + 40);
  }

  function onKey(event) {
    if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      dismiss();
    }
  }

  function mount() {
    document.body.appendChild(overlay);
    window.addEventListener("keydown", onKey);
    overlay.addEventListener("click", dismiss);
    revealNextLine();
  }

  if (document.body) {
    mount();
    return;
  }
  document.addEventListener("DOMContentLoaded", mount);
})();

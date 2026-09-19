/**
 * Home prompt card — Parallel-style tabs + mild type completion.
 * Cream palette only. Respects prefers-reduced-motion.
 */
(function () {
  const root = document.querySelector("[data-prompt-stage]");
  if (!root) {
    return;
  }

  const PROMPTS = {
    extract: {
      text: "Charity doc-extract playground — 122 scored runs and heatmaps",
      href: "demos/playgroup-202602-docextract/",
      hint: "Latest snapshot plus historic versions",
      tabId: "tab-extract",
    },
    laguna: {
      text: "py-bug-trace sweep explorer — Laguna-XS.2 ranked 12 of 29",
      href: "demos/laguna-py-bug-trace/?view=explorer.html",
      hint: "Heatmap and Pareto view",
      tabId: "tab-laguna",
    },
    tripwire: {
      text: "Tripwire dashboard — security and quality scanning prototype",
      href: "demos/tripwire-dashboard/",
      hint: "Interactive FolderGate-style panels",
      tabId: "tab-tripwire",
    },
    github: {
      text: "awesome-ai-ml-dl — curated AI and ML resources on GitHub",
      href: "https://github.com/neomatrix369/awesome-ai-ml-dl",
      hint: "Also RagCheck, awesome-graal, and more",
      tabId: "tab-github",
    },
  };

  const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
  const typedEl = root.querySelector("[data-prompt-typed]");
  const caretEl = root.querySelector("[data-prompt-caret]");
  const runEl = root.querySelector("[data-prompt-run]");
  const hintEl = root.querySelector("[data-prompt-hint]");
  const panel = root.querySelector('[role="tabpanel"]');
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let typeTimer = null;
  let holdTimer = null;

  function clearTimers() {
    if (typeTimer) {
      window.clearTimeout(typeTimer);
    }
    if (holdTimer) {
      window.clearTimeout(holdTimer);
    }
    typeTimer = null;
    holdTimer = null;
  }

  function setMeta(key) {
    const prompt = PROMPTS[key];
    if (!prompt) {
      return;
    }
    if (runEl) {
      runEl.setAttribute("href", prompt.href);
    }
    if (hintEl) {
      hintEl.textContent = prompt.hint;
    }
    if (panel) {
      panel.setAttribute("aria-labelledby", prompt.tabId);
    }
  }

  function typePrompt(key) {
    const prompt = PROMPTS[key];
    if (!prompt || !typedEl) {
      return;
    }
    clearTimers();
    setMeta(key);
    if (caretEl) {
      caretEl.classList.remove("is-done");
    }

    if (reduceMotion) {
      typedEl.textContent = prompt.text;
      if (caretEl) {
        caretEl.classList.add("is-done");
      }
      return;
    }

    typedEl.textContent = "";
    let i = 0;
    const stepMs = 38;

    function tick() {
      i += 1;
      typedEl.textContent = prompt.text.slice(0, i);
      if (i < prompt.text.length) {
        typeTimer = window.setTimeout(tick, stepMs);
        return;
      }
      if (caretEl) {
        caretEl.classList.add("is-done");
      }
      holdTimer = window.setTimeout(function () {
        const keys = Object.keys(PROMPTS);
        const next = keys[(keys.indexOf(key) + 1) % keys.length];
        activate(next, true);
      }, 4200);
    }

    tick();
  }

  function activate(key, fromAuto) {
    if (!PROMPTS[key]) {
      return;
    }
    tabs.forEach(function (t) {
      const on = t.getAttribute("data-prompt-key") === key;
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    if (!fromAuto) {
      clearTimers();
    }
    typePrompt(key);
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      activate(tab.getAttribute("data-prompt-key"), false);
    });
  });

  activate("extract", false);
})();

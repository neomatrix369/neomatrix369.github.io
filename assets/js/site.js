// Safety net for file:// previews and failed manifest fetches. Titles and hrefs
// must match pages/manifest.json; the child lists are deliberately condensed.
const FALLBACK_PAGES = [
  {
    title: "py-bug-trace · Laguna eval",
    description: "Poolside Laguna hackathon benchmark — hosted from HF laguna-eval-experiments.",
    kind: "group",
    children: [
      {
        title: "Project page",
        description: "Headline findings and Hugging Face source links.",
        href: "pages/laguna-py-bug-trace.html",
        kind: "static",
      },
      {
        title: "Interactive explorer",
        description: "Filter models, levels, and tasks.",
        href: "demos/laguna-py-bug-trace/?view=explorer.html",
        kind: "interactive",
      },
      {
        title: "All reports hub",
        description: "One-pager, write-up, report, level scorecards.",
        href: "demos/laguna-py-bug-trace/",
        kind: "static",
      },
    ],
  },
  {
    title: "UK Charity Doc Extract",
    description: "Multi-model PDF extraction benchmark — 124 scored runs.",
    kind: "group",
    children: [
      {
        title: "Project page",
        description: "Findings and methodology.",
        href: "pages/playgroup-202602-docextract.html",
        kind: "static",
      },
      {
        title: "Model extraction playground",
        description: "Latest plus 25 historic snapshots.",
        href: "demos/playgroup-202602-docextract/",
        kind: "interactive",
      },
      {
        title: "Doubleword extraction guide",
        description: "Video walkthrough of batch extraction.",
        href: "demos/playgroup-202602-docextract/extractor-all-doubleword.html",
        kind: "static",
      },
    ],
  },
  {
    title: "Projects",
    description: "11 open source repos & benchmarks — AgentVetter, SIE, rag-params-finder, FalsifyBench, Self-Improving Teams, RagCheck, and more.",
    href: "pages/projects.html",
    kind: "static",
  },
  {
    title: "AgentVetter dashboard",
    description: "FolderGate-style security and quality scanning dashboard.",
    href: "demos/agentvetter-dashboard/",
    kind: "interactive",
  },
  {
    title: "Claude Code concept map",
    description: "Pan/zoom map of Claude Code extension points, hooks, and APIs.",
    href: "demos/claude-code-concept-map.html",
    kind: "interactive",
  },
];

/** Cards are built as HTML strings, so manifest text has to be escaped —
 *  an unescaped "&" or "<" in a title would otherwise corrupt the markup. */
function esc(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[ch]);
}

function renderSubCard(child) {
  const tagClass = child.kind === "interactive" ? "tag tag--interactive" : "tag";
  return `
    <article class="page-card-sub">
      <span class="${tagClass}">${esc(child.kind)}</span>
      <h4>${esc(child.title)}</h4>
      <p>${esc(child.description)}</p>
      <a class="button" href="${esc(child.href)}">Open</a>
    </article>
  `;
}

function toggleGroup(btn, childrenId) {
  const children = document.getElementById(childrenId);
  const expanded = btn.getAttribute("aria-expanded") === "true";
  btn.setAttribute("aria-expanded", String(!expanded));
  if (expanded) {
    children.classList.add("page-card-nested--collapsed");
    btn.textContent = `Explore ${children.children.length} pages ›`;
  } else {
    children.classList.remove("page-card-nested--collapsed");
    btn.textContent = "Collapse ↑";
  }
}

function renderPageCard(page) {
  if (page.kind === "group" && Array.isArray(page.children) && page.children.length > 0) {
    const id = `group-${page.title.toLowerCase().replace(/\W+/g, "-")}`;
    return `
      <article class="page-card page-card--group">
        <div class="page-card-group-header">
          <span class="tag">${esc(page.tag || "benchmark")}</span>
          <div class="page-card-group-meta">
            <h3>${esc(page.title)}</h3>
            <p>${esc(page.description)}</p>
          </div>
          <button
            class="button page-card-toggle"
            aria-expanded="false"
            aria-controls="${id}-children"
            onclick="toggleGroup(this, '${id}-children')"
          >Explore ${page.children.length} pages &rsaquo;</button>
        </div>
        <div class="page-card-nested page-card-nested--collapsed" id="${id}-children" role="list">
          ${page.children.map(renderSubCard).join("")}
        </div>
      </article>
    `;
  }

  const tagClass = page.kind === "interactive" ? "tag tag--interactive" : "tag";

  return `
    <article class="page-card">
      <span class="${tagClass}">${esc(page.kind)}</span>
      <h3>${esc(page.title)}</h3>
      <p>${esc(page.description)}</p>
      <a class="button" href="${esc(page.href)}">Open page</a>
    </article>
  `;
}

async function loadPages() {
  const grid = document.querySelector("[data-page-grid]");
  if (!grid) {
    return;
  }

  let pages = FALLBACK_PAGES;

  try {
    const response = await fetch("pages/manifest.json", { cache: "no-store" });
    if (response.ok) {
      const manifest = await response.json();
      if (Array.isArray(manifest.pages) && manifest.pages.length > 0) {
        pages = manifest.pages;
      }
    }
  } catch (_error) {
    // Local file:// previews and offline use fall back to baked-in examples.
  }

  grid.innerHTML = pages.map(renderPageCard).join("");
}

document.addEventListener("DOMContentLoaded", loadPages);

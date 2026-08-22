const FALLBACK_PAGES = [
  {
    title: "Example static page",
    description: "A simple standalone HTML page with shared site styling.",
    href: "pages/example-static.html",
    kind: "static",
  },
  {
    title: "Example interactive page",
    description: "Canvas demo with keyboard and pointer controls.",
    href: "demos/example-interactive.html",
    kind: "interactive",
  },
];

function renderPageCard(page) {
  const tagClass =
    page.kind === "interactive" ? "tag tag--interactive" : "tag";

  return `
    <article class="page-card">
      <span class="${tagClass}">${page.kind}</span>
      <h3>${page.title}</h3>
      <p>${page.description}</p>
      <a class="button" href="${page.href}">Open page</a>
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

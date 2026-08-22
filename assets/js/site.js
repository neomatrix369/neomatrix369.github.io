const FALLBACK_PAGES = [
  {
    title: "UK Charity Doc Extract",
    description: "Multi-model PDF extraction benchmark — 111 scored runs across OpenRouter, Doubleword, and V7 Go.",
    href: "pages/playgroup-202602-docextract.html",
    kind: "static",
  },
  {
    title: "Projects",
    description: "Open source repos with links to live demos on this site.",
    href: "pages/projects.html",
    kind: "static",
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

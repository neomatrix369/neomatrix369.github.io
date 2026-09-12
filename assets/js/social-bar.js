/**
 * Fixed minimal social strip — same links as github.com/neomatrix369 README badges.
 * Self-contained (injects CSS + markup) so demos without site.css still get the bar.
 */
(function () {
  if (document.getElementById("site-social-bar")) {
    return;
  }
  if (new URLSearchParams(location.search).get("embed") === "1") {
    return;
  }

  const LINKS = [
    { label: "X", href: "https://x.com/theNeomatrix369", title: "X / Twitter" },
    { label: "Mastodon", href: "https://mastodon.online/@neomatrix369", title: "Mastodon", rel: "me" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/mani-sarkar/", title: "LinkedIn" },
    { label: "Kaggle", href: "https://www.kaggle.com/neomatrix369", title: "Kaggle" },
    { label: "HF", href: "https://huggingface.co/neomatrix369", title: "Hugging Face" },
    { label: "Medium", href: "https://medium.com/@neomatrix369", title: "Medium" },
    { label: "Blog", href: "https://neomatrix369.wordpress.com/", title: "Blog" },
    { label: "YouTube", href: "https://www.youtube.com/user/neomatrix369/", title: "YouTube" },
    { label: "Slides", href: "https://www.slideshare.net/neomatrix369/", title: "SlideShare" },
    { label: "GitHub", href: "https://github.com/neomatrix369", title: "GitHub" },
  ];

  const style = document.createElement("style");
  style.id = "site-social-bar-style";
  style.textContent = `
    #site-social-bar {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 100000;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      min-height: 1.75rem;
      padding: 0.2rem 0.65rem;
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
      font: 500 0.6875rem/1.2 "IBM Plex Sans", system-ui, sans-serif;
      letter-spacing: 0.01em;
      color: #5c564c;
      background: rgba(245, 242, 234, 0.94);
      border-top: 1px solid rgba(28, 25, 21, 0.14);
      backdrop-filter: blur(8px);
      box-shadow: 0 -1px 8px rgba(28, 25, 21, 0.05);
    }
    #site-social-bar a {
      flex: 0 0 auto;
      padding: 0.15rem 0.4rem;
      color: #7a5c2e;
      text-decoration: none;
      white-space: nowrap;
    }
    #site-social-bar a:hover,
    #site-social-bar a:focus-visible {
      color: #1c1915;
      text-decoration: underline;
      outline: none;
    }
    #site-social-bar .ssb-sep {
      flex: 0 0 auto;
      color: rgba(28, 25, 21, 0.22);
      user-select: none;
    }
    body.site-social-bar-on {
      padding-bottom: 1.85rem;
    }
    @media (prefers-reduced-motion: reduce) {
      #site-social-bar {
        backdrop-filter: none;
      }
    }
  `;
  document.head.appendChild(style);

  const nav = document.createElement("nav");
  nav.id = "site-social-bar";
  nav.setAttribute("aria-label", "Social profiles");

  const parts = [];
  LINKS.forEach((link, index) => {
    if (index > 0) {
      parts.push('<span class="ssb-sep" aria-hidden="true">·</span>');
    }
    const rel = link.rel ? ` rel="noopener ${link.rel}"` : ' rel="noopener"';
    parts.push(
      `<a href="${link.href}" title="${link.title}"${rel} target="_blank">${link.label}</a>`
    );
  });
  nav.innerHTML = parts.join("");

  function mount() {
    if (document.getElementById("site-social-bar")) {
      return;
    }
    document.body.appendChild(nav);
    document.body.classList.add("site-social-bar-on");
  }

  if (document.body) {
    mount();
    return;
  }
  document.addEventListener("DOMContentLoaded", mount);
})();

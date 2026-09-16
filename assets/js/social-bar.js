/**
 * Fixed social strip — logo + handle, matching github.com/neomatrix369 profile links.
 * Self-contained (injects CSS + markup) so demos without site.css still get the bar.
 */
(function () {
  if (document.getElementById("site-social-bar")) {
    return;
  }
  if (new URLSearchParams(location.search).get("embed") === "1") {
    return;
  }

  /** Compact monochrome brand marks (currentColor). */
  const ICONS = {
    x: '<svg class="ssb-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    mastodon: '<svg class="ssb-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M23.21 7.94c0 5.04-.66 11.29-6.64 11.29-.93 0-1.8-.2-2.56-.49l.44-2.15.85.2c1.14.22 2.14.07 2.51-.43.3-.4.25-1.12.25-1.68v-6.6c0-2.22-1.56-2.98-3.12-2.98-1.5 0-2.28.73-2.68 1.48l-.14.26-.14-.26c-.4-.75-1.18-1.48-2.68-1.48-1.56 0-3.12.76-3.12 2.98v6.6c0 .56-.05 1.28.25 1.68.37.5 1.37.65 2.51.43l.85-.2.44 2.15a7.8 7.8 0 0 1-2.56.49C1.45 19.23.79 12.98.79 7.94.79 3.5 3.74 2.2 3.74 2.2 5.02 1.42 8.08 1.2 11.97 1.2h.06c3.89 0 6.95.22 8.23 1 .01 0 2.95 1.3 2.95 5.74z"/></svg>',
    linkedin: '<svg class="ssb-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    // Official Kaggle "K" (Simple Icons wordmark, K glyph only — full wordmark is illegible at 1em)
    kaggle: '<svg class="ssb-icon" viewBox="0 7.25 3.8 7.2" aria-hidden="true"><path fill="currentColor" d="M.1025 7.3475c-.0681 0-.1022.0341-.1022.102v6.752c0 .0681.034.1022.1022.1022h.7049c.068 0 .1022-.034.1022-.1023v-1.481l.4187-.3985 1.5016 1.91c.041.0477.0884.0716.143.0716h.9091c.0476 0 .0748-.0135.0817-.0407.0135-.041.0066-.075-.0206-.1023l-1.9816-2.4618 1.9002-1.8384c.0204-.0205.0237-.051.01-.092-.0137-.0339-.0408-.051-.0816-.051h-.9398c-.0477 0-.0953.024-.143.0716L.9096 11.607V7.4496c0-.0679-.0342-.102-.1022-.102z"/></svg>',
    hf: '<svg class="ssb-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-3.2 8.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zm6.4 0a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zM12 17.2c-2.2 0-4-1.2-4.4-2.8h8.8c-.4 1.6-2.2 2.8-4.4 2.8z"/></svg>',
    medium: '<svg class="ssb-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.5 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6zm7.2 0c-1.5 0-2.7 2.15-2.7 4.8s1.2 4.8 2.7 4.8 2.7-2.15 2.7-4.8-1.2-4.8-2.7-4.8zm5.7 0c-.9 0-1.65 2.15-1.65 4.8s.75 4.8 1.65 4.8 1.65-2.15 1.65-4.8-.75-4.8-1.65-4.8z"/></svg>',
    blog: '<svg class="ssb-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.2 2C6.7 2 2.2 6.5 2.2 12s4.5 10 10 10c1.1 0 2-.9 2-2v-.5c0-.5.2-1 .5-1.4.3-.4.8-.6 1.3-.6H17c3.3 0 6-2.7 6-6 0-5.5-4.9-10-10.8-10zm-5 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>',
    youtube: '<svg class="ssb-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
    slides: '<svg class="ssb-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19.5 3h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3zM8 17H6v-6h2zm5 0h-2V7h2zm5 0h-2v-4h2z"/></svg>',
    github: '<svg class="ssb-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
  };

  // Ordered by prominence for this site: home base → professional → public → AI/ML → publishing → talks → secondary
  const LINKS = [
    { icon: "github", slug: "neomatrix369", href: "https://github.com/neomatrix369", name: "GitHub" },
    { icon: "linkedin", slug: "/in/mani-sarkar", href: "https://www.linkedin.com/in/mani-sarkar/", name: "LinkedIn" },
    { icon: "x", slug: "@theNeomatrix369", href: "https://x.com/theNeomatrix369", name: "X" },
    { icon: "kaggle", slug: "neomatrix369", href: "https://www.kaggle.com/neomatrix369", name: "Kaggle" },
    { icon: "hf", slug: "neomatrix369", href: "https://huggingface.co/neomatrix369", name: "Hugging Face" },
    { icon: "medium", slug: "@neomatrix369", href: "https://medium.com/@neomatrix369", name: "Medium" },
    { icon: "blog", slug: "neomatrix369", href: "https://neomatrix369.wordpress.com/", name: "Blog" },
    { icon: "slides", slug: "neomatrix369", href: "https://www.slideshare.net/neomatrix369/", name: "SlideShare" },
    { icon: "mastodon", slug: "@neomatrix369", href: "https://mastodon.online/@neomatrix369", name: "Mastodon", rel: "me" },
    { icon: "youtube", slug: "neomatrix369", href: "https://www.youtube.com/user/neomatrix369/", name: "YouTube" },
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
      justify-content: flex-start;
      gap: 0.15rem;
      min-height: 2.25rem;
      padding: 0.35rem 0.75rem;
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
      font: 500 0.875rem/1.25 "IBM Plex Sans", system-ui, sans-serif;
      letter-spacing: 0.01em;
      color: #5c564c;
      background: rgba(245, 242, 234, 0.94);
      border-top: 1px solid rgba(28, 25, 21, 0.14);
      backdrop-filter: blur(8px);
      box-shadow: 0 -1px 8px rgba(28, 25, 21, 0.05);
    }
    #site-social-bar a {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      flex: 0 0 auto;
      padding: 0.2rem 0.45rem;
      color: #7a5c2e;
      text-decoration: none;
      white-space: nowrap;
      border-radius: 4px;
    }
    #site-social-bar a:hover,
    #site-social-bar a:focus-visible {
      color: #1c1915;
      background: rgba(28, 25, 21, 0.06);
      outline: none;
    }
    #site-social-bar .ssb-icon {
      width: 1em;
      height: 1em;
      flex: 0 0 auto;
      display: block;
    }
    #site-social-bar .ssb-slug {
      font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
      font-size: 0.8125rem;
      font-weight: 500;
    }
    #site-social-bar .ssb-sep {
      flex: 0 0 auto;
      color: rgba(28, 25, 21, 0.22);
      user-select: none;
      padding: 0 0.1rem;
    }
    /* Center the row when it fits; keep left edge reachable when it overflows. */
    #site-social-bar::before,
    #site-social-bar::after {
      content: "";
      flex: 1 0 0.5rem;
    }
    body.site-social-bar-on {
      padding-bottom: 2.5rem;
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
    const icon = ICONS[link.icon] || "";
    parts.push(
      `<a href="${link.href}" title="${link.href}" aria-label="${link.name}: ${link.slug}"${rel} target="_blank">${icon}<span class="ssb-slug">${link.slug}</span></a>`
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

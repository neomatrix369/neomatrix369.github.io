# neomatrix369.github.io

Static GitHub Pages site for standalone HTML and interactive demos.

**Live site:** https://neomatrix369.github.io/

## Featured demos (hosted)

| Demo | URL |
|------|-----|
| Home — all demos & pages | https://neomatrix369.github.io/ |
| Projects hub (Tripwire, SIE, rag-params-finder, …) | https://neomatrix369.github.io/pages/projects.html |
| Doc extract — project write-up | https://neomatrix369.github.io/pages/playgroup-202602-docextract.html |
| Doc extract — playground archive (21 snapshots) | https://neomatrix369.github.io/demos/playgroup-202602-docextract/ |
| Doc extract — Doubleword guide | https://neomatrix369.github.io/demos/playgroup-202602-docextract/extractor-all-doubleword.html |
| Laguna py-bug-trace — project page | https://neomatrix369.github.io/pages/laguna-py-bug-trace.html |
| Laguna py-bug-trace — reports & explorer | https://neomatrix369.github.io/demos/laguna-py-bug-trace/ |
| Tripwire dashboard | https://neomatrix369.github.io/demos/tripwire-dashboard/ |
| Claude Code concept map | https://neomatrix369.github.io/demos/claude-code-concept-map.html |

## Folder layout

```text
neomatrix369.github.io/
├── index.html              # landing page
├── .nojekyll               # skip Jekyll processing on GitHub Pages
├── assets/
│   ├── css/site.css        # shared styling
│   └── js/site.js          # index page loader
├── pages/
│   ├── manifest.json       # page catalog for the home page
│   └── *.html              # project summaries
└── demos/
    └── */                  # interactive archives & explorers
```

## Add a page

1. Put static HTML in `pages/` or interactive demos in `demos/`.
2. Add an entry to `pages/manifest.json`.

Use `"kind": "interactive"` for canvas, WebGL, or other JS-heavy pages. Group related pages with `"kind": "group"` and `children`.

## Local preview

```bash
cd neomatrix369.github.io
python3 -m http.server 8080
```

Open http://localhost:8080

## Tripwire dashboard (mock-only)

Hosted at https://neomatrix369.github.io/demos/tripwire-dashboard/

Source of truth is the Tripwire repo (`prototypes/dc-dashboard/`). This site keeps a **mock-only** snapshot (empty Supabase keys). Refresh after Tripwire dashboard changes:

```bash
./scripts/sync-tripwire-dashboard.sh
# or: bash .claude/skills/sync-tripwire-pages/scripts/sync.sh
```

Agent skill (project-local, gitignored): `.claude/skills/sync-tripwire-pages` — invoke as `/sync-tripwire-pages`.
Also linked from `.cursor/skills/` and `.codex/skills/` in the Tripwire repo.

Preview: http://localhost:8080/demos/tripwire-dashboard/

## Publish to GitHub Pages

1. Push this folder to the `main` branch of **`neomatrix369/neomatrix369.github.io`**.
2. In repo settings → Pages, set source to **Deploy from branch** → `main` → `/ (root)`.
3. Site: https://neomatrix369.github.io/

Optional custom domain: add a `CNAME` file at the repo root with your domain, then configure DNS at your registrar.

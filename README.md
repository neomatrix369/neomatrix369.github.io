# neomatrix369.github.io

Static GitHub Pages site for standalone HTML and interactive demos.

Live URL (after publishing): https://neomatrix369.github.io/

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
│   └── example-static.html
└── demos/
    └── example-interactive.html
```

## Add a page

1. Put static HTML in `pages/` or interactive demos in `demos/`.
2. Add an entry to `pages/manifest.json`:

```json
{
  "title": "My page",
  "description": "Short summary shown on the home page.",
  "href": "pages/my-page.html",
  "kind": "static"
}
```

Use `"kind": "interactive"` for canvas, WebGL, or other JS-heavy pages.

## Local preview

```bash
cd neomatrix369.github.io
python3 -m http.server 8080
```

Open http://localhost:8080

## Publish to GitHub Pages

1. Create a GitHub repo named **`neomatrix369.github.io`** under the `neomatrix369` account.
2. Push this folder to the `main` branch.
3. In repo settings → Pages, set source to **Deploy from branch** → `main` → `/ (root)`.
4. After the first deploy, the site is available at https://neomatrix369.github.io/

Optional custom domain: add a `CNAME` file at the repo root with your domain, then configure DNS at your registrar.

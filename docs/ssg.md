# SSG + OG Image Setup for Talks

> **Scope**: Implement *approach ①* — prerender each `/talks/:slug` route to a static HTML file that contains the correct Open Graph (OG) meta tags (title, description, image). Works on **GitHub Pages** without any runtime.

---

## 1. Rationale

* **GitHub Pages** is static only; crawlers (Twitter, Facebook, Slack, etc.) do **not** execute JavaScript.
* Therefore OG tags inserted client‑side (e.g. with React Helmet) are ignored.
* We solve this by generating an **HTML file per talk** *at build time*. These files include hard‑coded meta tags so crawlers fetch correct previews, while the site still operates as a SPA for users.

---

## 2. Metadata Source

NOTE from user: jsonである必要がなければ今のまま src/data/talks.tsでいきたい

Create a centralized JSON alongside slides:

```jsonc
// src/data/slidesMeta.json
{
  "20211211_devfest2021": {
    "title": "DevFest 2021 — Denoで〇〇",
    "description": "真麻が DevFest 2021 で登壇した Deno 活用事例。",
    "image": "/slides/thumbs/20211211_devfest2021.jpg",
    "pdf": "/slides/20211211_DevFest2021.pdf"
  },
  "20250613_norents": { /* … */ }
}
```

* **Key** = slug used in route (`/talks/20211211_devfest2021`).
* `image` path must be under `public/` so it copies verbatim to `dist/`.

---

## 3. Dependencies

```bash
pnpm add -D vite-plugin-prerender ejs   # or yarn / npm
```

* `vite-plugin-prerender` — crawls specified routes after build and produces static HTML.
* `ejs` — lightweight template engine to inject meta tags.

---

## 4. Template File

Create `public/prerender-template.ejs` (copied as part of build):

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title><%= title %></title>

  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="<%= title %>" />
  <meta property="og:description" content="<%= description %>" />
  <meta property="og:image" content="https://yoshiko-pg.github.io<%= image %>" />
  <meta property="og:url" content="https://yoshiko-pg.github.io/talks/<%= slug %>" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="<%= title %>" />
  <meta name="twitter:description" content="<%= description %>" />
  <meta name="twitter:image" content="https://yoshiko-pg.github.io<%= image %>" />
</head>
<body>
  <!-- React mounts here → same markup as dist/index.html -->
  <div id="root"></div>
  <script type="module" src="/assets/index.js"></script>
</body>
</html>
```

> **Note**: the script src path (`/assets/index.js`) matches Vite’s output; adjust if hash filenames used.

---

## 5. Vite Configuration

`vite.config.ts` additions:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import prerender from 'vite-plugin-prerender';
import slidesMeta from './src/data/slidesMeta.json';

export default defineConfig({
  base: '/', // user‑site repo, keep root
  plugins: [
    react(),
    prerender({
      staticDir: 'dist',            // where vite build outputs
      routes: Object.keys(slidesMeta).map(k => `/talks/${k}`),
      renderer: './scripts/prerender.ts' // custom renderer (next section)
    })
  ]
});
```

---

## 6. Custom Prerender Renderer

`scripts/prerender.ts` (executed by plugin):

```ts
import ejs from 'ejs';
import fs from 'node:fs/promises';
import path from 'node:path';
import slides from '../src/data/slidesMeta.json';
import { ResolvedConfig } from 'vite';

export async function render({ route, config }: { route: string; config: ResolvedConfig }) {
  const slug = route.split('/').pop()!;
  const meta = (slides as Record<string, any>)[slug];
  if (!meta) throw new Error(`No meta for ${slug}`);

  const templatePath = path.resolve('public/prerender-template.ejs');
  const template = await fs.readFile(templatePath, 'utf8');
  const html = ejs.render(template, { slug, ...meta });

  const outPath = path.join(config.build.outDir, route, 'index.html');
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, html);
}
```

* Plugin calls `render` for every route.
* Generates `dist/talks/<slug>/index.html` each containing correct meta.

---

## 7. SPA Fallback (unchanged)

After normal build, copy root `index.html` to `dist/404.html` **before** prerender runs, so unknown routes still hydrate React when a user navigates directly.

```jsonc
// package.json
{
  "scripts": {
    "postbuild": "cp dist/index.html dist/404.html"
  }
}
```

The prerendered files **override** fallback for their specific paths.

---

## 8. CI Workflow Impact

No changes to `actions/deploy-pages`; prerender runs in the same `pnpm run build` step because plugin hooks during build.

---

## 9. Validation Steps

1. `pnpm run build && npx serve dist` locally.
2. Visit `http://localhost:5000/talks/20211211_devfest2021` in a **private tab** – should load React app.
3. Test OG tags with:

   ```bash
   curl -s http://localhost:5000/talks/20211211_devfest2021 | grep og:image
   ```
4. After deploy, check with [Twitter Card Validator](https://cards-dev.twitter.com/validator) or [Meta Sharing Debugger](https://developers.facebook.com/tools/debug/).

---

## 10. Future Maintenance

* Add new talk → append entry to `slidesMeta.json` → route auto‑included at next build.
* If slug removed, remember to delete old `dist/talks/slug` folder via clean build (`rimraf dist`).
* For non‑talk pages needing OG, extend routes list & meta source similarly.

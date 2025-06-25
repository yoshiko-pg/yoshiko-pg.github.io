0. Purpose

Create a personal portfolio site that showcases projects and allows visitors to vertically scroll through past conference slide decks (PDF).
Target hosting platform is GitHub Pages; the project must build to fully static assets that can be served from the gh-pages branch without a runtime.

1. High-Level Stack

Layer	Choice	Notes
Build Tooling	Vite 6	React/TS template (npm create vite@latest <name> -- --template react-ts).
Framework	React 19	Client-side only; Server Components not required.
Language	TypeScript 5.5	Strict mode.
Styling	CSS Modules	.module.css; PostCSS nesting enabled. No Tailwind/CSS-in-JS.
Animation	framer-motion 12	Optional; used for subtle page transitions/reveals.
PDF Rendering	react-pdf ( + pdfjs-dist)	Canvas render; paired with react-window for virtualization.
Virtual Scroll	react-window	FixedSizeList variant.
Deployment	GitHub Actions + peaceiris/actions-gh-pages@v4	Workflow builds and publishes to gh-pages.

2. Functional Requirements

2.1 Pages & Routing
	•	Home / – Landing with hero section, project cards.
	•	Talks Index /talks – List of slide decks (title, event, date, thumbnail).
	•	Talk Detail /talks/:slug – Vertical-scroll PDF viewer.

Routing lib: React Router v6.
Scroll restoration: Preserve position when navigating back from a talk.

2.2 PDF Vertical Scroll Viewer
	•	Renders all pages stacked vertically; user scrolls to read.
	•	Virtualize: Only pages within viewport ±1 are mounted.
	•	Canvas width responsive; max width ≈ 800 px.
	•	Loading states: skeleton per page.
	•	Keyboard shortcuts: J/K or ↓/↑ to jump one page.
	•	Optional fallback: if PDF fails, show link to direct download.

2.3 PDF Asset Handling
	•	PDFs stored under public/slides/.
	•	No backend; CORS-safe paths.
	•	If a deck exceeds 100 pages or >10 MB, convert to per-page PNGs at build time (stretch goal).

2.4 Performance Targets (Desktop Lighthouse)

Metric	Threshold
FCP	≤ 1.5 s
TTI	≤ 2.5 s
CLS	< 0.1

3. Non-Functional Requirements
	•	Accessibility: All interactive elements keyboard reachable; images with alt.
	•	SEO / Metadata: Per-page title & description; Open Graph images.
	•	Testing: unit (Vitest), component (React Testing Library) for viewer.
	•	CI: pnpm lint && pnpm test && pnpm build must pass before deploy.

4. Project Structure (suggested)

/portfolio-root
├─ public/
│  └─ slides/
│     ├─ talk1.pdf
│     └─ talk2.pdf
├─ src/
│  ├─ assets/
│  ├─ components/
│  │  ├─ PdfScrollViewer.tsx
│  │  └─ ...
│  ├─ pages/
│  │  ├─ Home.tsx
│  │  ├─ Talks.tsx
│  │  └─ TalkDetail.tsx
│  ├─ hooks/
│  ├─ styles/
│  │  └─ globals.module.css
│  └─ routes.tsx
├─ .github/
│  └─ workflows/deploy.yml
└─ vite.config.ts

5. Key NPM Scripts

{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "pnpm build && gh-pages -d dist",
    "lint": "eslint src --ext .ts,.tsx",
    "test": "vitest"
  }
}

6. Deployment Workflow (GitHub Actions)

name: Deploy
on:
  push:
    branches: [main]
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - run: pnpm i
      - run: pnpm run lint
      - run: pnpm run test -- --run
      - run: pnpm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist

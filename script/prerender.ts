import fs from "node:fs/promises";
import path from "node:path";
import { talks } from "../src/data/talks.js";
import {
  SITE_ORIGIN,
  appPages,
  homePage,
  talkPage,
  type PageMeta,
} from "../src/data/pageMeta.js";

const MARKER_START = "<!-- head-meta:start -->";
const MARKER_END = "<!-- head-meta:end -->";

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function renderHeadTags(page: PageMeta): string {
  const url = SITE_ORIGIN + page.path;
  const image = SITE_ORIGIN + page.image;
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  return [
    `<title>${title}</title>`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${page.type}" />`,
    `<meta property="og:site_name" content="yoshiko" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:site" content="@yoshiko_pg" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ].join("\n    ");
}

export function injectHeadTags(baseHtml: string, page: PageMeta): string {
  const start = baseHtml.indexOf(MARKER_START);
  const end = baseHtml.indexOf(MARKER_END);
  if (start === -1 || end === -1 || end < start) {
    throw new Error("head-meta markers not found in dist/index.html");
  }
  return (
    baseHtml.slice(0, start) +
    MARKER_START +
    "\n    " +
    renderHeadTags(page) +
    "\n    " +
    baseHtml.slice(end)
  );
}

async function generateStaticPages() {
  const distDir = "dist";

  try {
    // Viteが出力したindex.html(ハッシュ付きアセットのリンク済み)をベースにする
    const baseHtml = await fs.readFile(
      path.join(distDir, "index.html"),
      "utf8",
    );

    const pages: PageMeta[] = [homePage, ...appPages, ...talks.map(talkPage)];

    for (const page of pages) {
      const html = injectHeadTags(baseHtml, page);
      const outDir = path.join(distDir, page.path.slice(1));
      await fs.mkdir(outDir, { recursive: true });
      await fs.writeFile(path.join(outDir, "index.html"), html);
      console.log(`Generated: ${page.path}index.html`);
    }

    console.log(`✅ Generated ${pages.length} pages`);
  } catch (error) {
    console.error("❌ Error generating static pages:", error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateStaticPages();
}

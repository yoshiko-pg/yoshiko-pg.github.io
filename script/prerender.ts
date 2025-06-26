import ejs from 'ejs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { talks } from '../src/data/talks.js';
import type { ResolvedConfig } from 'vite';

export async function render({ route, config }: { route: string; config: ResolvedConfig }) {
  const slug = route.split('/').pop()!;
  const talk = talks.find(t => t.slug === slug);
  
  if (!talk) {
    throw new Error(`No talk found for slug: ${slug}`);
  }

  const templatePath = path.resolve('public/prerender-template.ejs');
  const template = await fs.readFile(templatePath, 'utf8');
  
  const description = talk.description || `${talk.event}での発表「${talk.title}」のスライドです。`;
  
  const html = ejs.render(template, {
    slug: talk.slug,
    title: talk.title,
    description,
    thumbnail: talk.thumbnail
  });

  const outPath = path.join(config.build.outDir, route, 'index.html');
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, html);
}
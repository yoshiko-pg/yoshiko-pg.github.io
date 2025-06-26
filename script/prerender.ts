import ejs from 'ejs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { talks } from '../src/data/talks.js';

async function findJSFile(distDir: string): Promise<string> {
  const assetsDir = path.join(distDir, 'assets');
  const files = await fs.readdir(assetsDir);
  const found = files.find(file => file.startsWith('index-') && file.endsWith('.js'));
  return found ? `/assets/${found}` : '/assets/index.js';
}

async function findCSSFile(distDir: string): Promise<string> {
  const assetsDir = path.join(distDir, 'assets');
  const files = await fs.readdir(assetsDir);
  const found = files.find(file => file.endsWith('.css'));
  return found ? `/assets/${found}` : '/assets/index.css';
}

async function generateStaticPages() {
  const distDir = 'dist';
  const talkTemplatePath = path.resolve('public/prerender-template.ejs');
  const indexTemplatePath = path.resolve('public/index-template.ejs');
  
  try {
    const jsFile = await findJSFile(distDir);
    const cssFile = await findCSSFile(distDir);
    
    // Generate index.html with OGP
    const indexTemplate = await fs.readFile(indexTemplatePath, 'utf8');
    const indexHtml = ejs.render(indexTemplate, {
      jsFile,
      cssFile
    });
    await fs.writeFile(path.join(distDir, 'index.html'), indexHtml);
    console.log('Generated: /index.html with OGP');
    
    // Generate talk pages
    const talkTemplate = await fs.readFile(talkTemplatePath, 'utf8');
    for (const talk of talks) {
      const description = talk.description || `${talk.date.replaceAll('-', '/')}の${talk.event}での発表「${talk.title}」のスライドです。`;
      
      const html = ejs.render(talkTemplate, {
        slug: talk.slug,
        title: talk.title,
        description,
        thumbnail: talk.thumbnail,
        jsFile,
        cssFile
      });

      const talkDir = path.join(distDir, 'talks', talk.slug);
      await fs.mkdir(talkDir, { recursive: true });
      await fs.writeFile(path.join(talkDir, 'index.html'), html);
      
      console.log(`Generated: /talks/${talk.slug}/index.html`);
    }
    
    console.log(`✅ Generated 1 index page + ${talks.length} talk pages`);
  } catch (error) {
    console.error('❌ Error generating static pages:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateStaticPages();
}
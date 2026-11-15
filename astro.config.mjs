// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import deploy from './deploy.config.mjs';

// The site's real address: canonical, hreflang, social and structured-data URLs.
const SITE = 'https://mehovconsult.com';
const BASE = deploy.basePath.replace(/\/+$/, '');

// leave the redirect pages and the 404 out of the sitemap
const NOT_IN_SITEMAP = [SITE, `${SITE}/blog`, `${SITE}/404`];

/**
 * Pages are written for a domain root ("/bg/about", "/images/logo.png").
 * When the site is served from a sub-path (GitHub Pages project site), prefix
 * every root-relative link, image and stylesheet URL in the built files.
 */
function prefixBasePath(base) {
  const rebase = (s) =>
    s
      .replace(/(\s(?:href|src|action|data-href|poster)=)(["'])\/(?!\/)/g, `$1$2${base}/`)
      .replace(/(url\(\s*["']?)\/(?!\/)/g, `$1${base}/`)
      .replace(/(http-equiv="refresh"\s+content="\d+;\s*url=)\/(?!\/)/gi, `$1${base}/`);
  return {
    name: 'prefix-base-path',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        if (!base) return;
        const root = fileURLToPath(dir);
        for (const file of await fs.readdir(root, { recursive: true })) {
          if (!/\.(html|css)$/.test(file)) continue;
          const p = path.join(root, file);
          const src = await fs.readFile(p, 'utf8');
          const out = rebase(src);
          if (out !== src) await fs.writeFile(p, out);
        }
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: SITE,
  // At a domain root URLs have no trailing slash (/bg/about), as on the old
  // site: build bg/about.html. GitHub Pages can't serve bg.html next to a bg/
  // folder, so under a sub-path build bg/about/index.html instead.
  trailingSlash: BASE ? 'ignore' : 'never',
  build: { format: BASE ? 'directory' : 'file' },
  // Real 301s on Netlify come from public/_redirects; these meta-refresh
  // pages keep the redirects working in `npm run dev` and on other hosts.
  redirects: {
    '/': '/bg',
    '/blog': '/bg/blog',
  },
  markdown: {
    // keep the posts' punctuation exactly as written (no "smart" quotes/dashes)
    processor: satteri({ features: { smartPunctuation: false } }),
  },
  integrations: [
    sitemap({ filter: (page) => !NOT_IN_SITEMAP.includes(page.replace(/\/$/, '')) }),
    prefixBasePath(BASE),
  ],
});

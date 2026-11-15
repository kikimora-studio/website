# mehovconsult-web

Astro rebuild of [mehovconsult.com](https://mehovconsult.com), the Mehov Consult
accounting firm site (Bulgarian, English, Russian). The old site ran on the
Composity platform (Next.js); this is the same site as plain static files, with
the blog in Markdown.

## Commands

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm install`     | Install dependencies                          |
| `npm run dev`     | Local dev server at http://localhost:4321     |
| `npm run build`   | Build the site into `dist/`                   |
| `npm run preview` | Serve the built `dist/` locally               |

## Writing a blog post

Add a Markdown file to `src/content/blog/`. The file name is the address:
`eood-ili-et.md` is published at `/blog/eood-ili-et`, and it appears on
`/bg/blog` (newest first) and in the sitemap automatically.

```markdown
---
title: "Заглавие на статията"                # heading on the page
seoTitle: "Кратко заглавие за Google"         # optional; <title> and blog card
description: "1–2 изречения за Google и за картата в блога."
date: 2026-11-20
lead: "Уводен абзац, показан с червена черта отляво."   # optional
readingTime: 4                               # optional; estimated if omitted
cta:                                         # optional; a general one is used if omitted
  text: "Текст в карето накрая на статията."
  primary: { label: "Регистрация на фирма", href: "/bg/services/company-registration" }
  secondary: { label: "Безплатна оферта", href: "/bg/contact#contact-form" }
---

## Първо подзаглавие

Текст… **удебелен**, [връзка](/bg/services/accounting).

- точка
- точка

## Често задавани въпроси

### Въпрос?

Отговор.
```

- A `## Често задавани въпроси` section with `### question` / answer pairs is
  also published as FAQ structured data for Google — nothing else to do.
- `updated: 2026-12-01` tells Google the post was revised.
- `draft: true` keeps a post off the live site (it still shows in `npm run dev`).

## Where things are

| Path | Contents |
| --- | --- |
| `src/pages/{bg,en,ru}/…` | The pages. Their HTML, styles and small scripts were carried over from the old site as-is. |
| `src/pages/blog/[slug].astro` | Blog post template. |
| `src/pages/bg/blog/index.astro` | Blog list. |
| `src/layouts/Layout.astro` | `<head>` (title, canonical, hreflang, social tags, structured data), header, footer, sticky bar, cookie banner. |
| `src/i18n/ui.ts` | Header / footer / cookie banner / form texts in each language. |
| `src/data/routes.ts` | Which pages are translations of each other (hreflang tags and the language switcher). |
| `src/data/organization.ts` | Company structured data (name, address, ЕИК…). |
| `src/scripts/site.js` | Navigation, language switcher, enquiry modal and forms, cookie consent / Google Analytics. |
| `src/styles/` | Shared CSS from the old site, in its original order. |
| `public/images/` | Logos, hero image, flags, favicon (previously hosted on assets.composity.cloud). |
| `public/_redirects` | 301 redirects (Netlify). |
| `deploy.config.mjs` | Where this copy is hosted: sub-path and form service (see Deploying). |

## Deploying

`deploy.config.mjs` is the only file that changes between hosts:

- `basePath` — `''` at a domain root, or the sub-path the site is served under
  (e.g. `'/website'` for `kikimora-studio.github.io/website`). Links, images and
  styles get that prefix at build time; canonical and SEO URLs always point at
  `https://mehovconsult.com`.
- `formEndpoint` — empty for Netlify Forms, otherwise a
  [Formspree](https://formspree.io) endpoint (`https://formspree.io/f/…`).
  Each enquiry is emailed to the Formspree account's address.

### GitHub Pages

`.github/workflows/astro.yml` builds and publishes on every push to `main`.
Set `basePath` to the repository's sub-path and `formEndpoint` to the
Formspree form. `public/_redirects` and `netlify.toml` are ignored there;
`/` and `/blog` still redirect through small HTML pages.

### Netlify (mehovconsult.com)

1. Create a Netlify site from the Git repository (set **Base directory** to the
   site's folder if it isn't at the repository root). Build command and
   publish folder come from `netlify.toml`.
2. **Forms:** leave `formEndpoint` empty, turn on form detection (Site
   configuration → Forms) and add an email notification for the `contact`
   form. Or keep using Formspree — it works on any host.
3. **Domain:** add `mehovconsult.com` (primary) and `www.mehovconsult.com`, then
   point DNS at Netlify. `www` and the old URLs redirect via `public/_redirects`.
4. In Google Search Console, submit `https://mehovconsult.com/sitemap-index.xml`
   (the old `/sitemap.xml` redirects there).

## Differences from the old site

- **Forms** go to Formspree or Netlify Forms (with a honeypot spam trap)
  instead of the Composity API with a Cloudflare Turnstile check. The submit
  button no longer waits for the Turnstile widget.
- **Blog list** is newest first by publication date and is built into the page;
  the old site fetched it from the Composity API in the browser and showed it
  in last-edited order.
- **`/bg/blog/<slug>`** duplicates of posts now redirect to the canonical
  `/blog/<slug>`.
- **Tailwind CDN** is gone. Its only effect (a CSS reset plus `.container` and
  `.grid`) is in `src/styles/tailwind-compat.css`, so pages no longer jump when
  it loads.
- **404** page is branded instead of blank.

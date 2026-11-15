import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const link = z.object({ label: z.string(), href: z.string() });

// Blog posts: one Markdown file per post in src/content/blog/.
// The file name is the URL: eood-ili-et.md -> /blog/eood-ili-et
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    /** Heading shown on the post page (<h1>). */
    title: z.string(),
    /** <title> / Google / social title, also used on the blog list cards. Defaults to `title`. */
    seoTitle: z.string().optional(),
    /** Meta description, also the excerpt on the blog list cards. */
    description: z.string(),
    /** Publication date (newest first on the blog list). */
    date: z.coerce.date(),
    /** Last significant update, for Google. Defaults to `date`. */
    updated: z.coerce.date().optional(),
    /** Minutes to read. Estimated from the text when omitted. */
    readingTime: z.number().int().positive().optional(),
    /** Intro paragraph shown under the title with a red bar. */
    lead: z.string().optional(),
    /** Call-to-action box at the end of the post. A general one is used when omitted. */
    cta: z.object({ text: z.string(), primary: link, secondary: link }).optional(),
    /** Drafts are visible in `npm run dev` only. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };

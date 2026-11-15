import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** Published posts, newest first (drafts too while running `npm run dev`). */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', (p) => import.meta.env.DEV || !p.data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const postPath = (post: Post) => `/blog/${post.id}`;

const MONTHS_BG = ['януари', 'февруари', 'март', 'април', 'май', 'юни', 'юли', 'август', 'септември', 'октомври', 'ноември', 'декември'];

/** "2 октомври 2026 г." */
export function formatDate(d: Date): string {
  return `${d.getUTCDate()} ${MONTHS_BG[d.getUTCMonth()]} ${d.getUTCFullYear()} г.`;
}

/** "2026-10-02" */
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

/** Markdown -> plain text, enough for word counts and FAQ answers. */
function plain(md: string): string {
  const escaped: string[] = [];
  return md
    .replace(/\\([^\sA-Za-z0-9])/g, (_, c) => `\u0000${escaped.push(c) - 1}\u0000`) // keep \* \_ etc. literal
    .replace(/^\s*(?:[-+*]|\d+[.)])\s+/gm, '') // list markers
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links
    .replace(/\*\*|__|\*|_|`/g, '')
    .replace(/\u0000(\d+)\u0000/g, (_, i) => escaped[+i])
    .replace(/\s+/g, ' ')
    .trim();
}

export function readingMinutes(post: Post): number {
  if (post.data.readingTime) return post.data.readingTime;
  const words = plain(post.body ?? '').split(' ').length + (post.data.lead ?? '').split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export const FAQ_HEADING = 'Често задавани въпроси';

/**
 * Questions and answers from the post's "## Често задавани въпроси" section
 * (each "### question" followed by its answer), for Google's FAQ rich results.
 */
export function faqFromMarkdown(body = ''): { question: string; answer: string }[] {
  const lines = body.split(/\r?\n/);
  const start = lines.findIndex((l) => l.replace(/^##\s+/, '').trim() === FAQ_HEADING && l.startsWith('## '));
  if (start < 0) return [];
  const faq: { question: string; answer: string[] }[] = [];
  for (const line of lines.slice(start + 1)) {
    if (/^##\s/.test(line)) break;
    const q = line.match(/^###\s+(.*)/);
    if (q) faq.push({ question: plain(q[1]), answer: [] });
    else if (faq.length && line.trim()) faq[faq.length - 1].answer.push(line);
  }
  return faq.map((f) => ({ question: f.question, answer: plain(f.answer.join('\n')) }));
}

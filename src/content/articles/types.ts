/**
 * Article content model for the GHL Hire guides (/blog).
 *
 * Articles are plain TypeScript objects so they are statically rendered,
 * indexable, and need no markdown dependency. Inline text supports two
 * markers only: **bold** and [label](https://url).
 */

export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string; id: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'callout'; title?: string; text: string }
  | { type: 'table'; head: string[]; rows: string[][] };

export type ArticleCategory =
  | 'AI Skills'
  | 'Career Moves'
  | 'For Agencies'
  | 'Freelancing';

export interface Article {
  slug: string;
  title: string;
  /** 140-160 characters, used for meta description and cards. */
  description: string;
  category: ArticleCategory;
  /** ISO date, e.g. 2026-11-18 */
  publishedAt: string;
  readingMinutes: number;
  /** Public path of the cover image, e.g. /articles/<slug>.jpg */
  cover: string;
  coverAlt: string;
  /** 3-4 one-sentence takeaways shown at the top of the article. */
  keyTakeaways: string[];
  body: ArticleBlock[];
  faq?: { q: string; a: string }[];
  /** Only real pages that were opened and checked. */
  sources?: { label: string; url: string }[];
  /** Job-board search term used for the "open roles" link, e.g. "voice ai". */
  relatedSearch?: string;
}

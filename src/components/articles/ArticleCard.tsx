import Image from 'next/image';
import Link from 'next/link';
import type { Article } from '@/content/articles';
import { formatArticleDate } from '@/content/articles';

interface ArticleCardProps {
  article: Article;
  /** The lead card is larger and sits beside its image on desktop. */
  lead?: boolean;
  priority?: boolean;
}

export default function ArticleCard({ article, lead = false, priority = false }: ArticleCardProps) {
  return (
    <article className={lead ? 'group grid gap-6 md:grid-cols-[1.25fr_1fr] md:items-center md:gap-10' : 'group flex flex-col'}>
      <Link
        href={`/blog/${article.slug}`}
        className="block min-h-0 overflow-hidden rounded-xl bg-ink outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={article.cover}
          alt=""
          width={1280}
          height={720}
          priority={priority}
          sizes={lead ? '(max-width: 768px) 100vw, 55vw' : '(max-width: 768px) 100vw, 33vw'}
          className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </Link>
      <div className={lead ? '' : 'mt-4 flex flex-1 flex-col'}>
        <p className="text-sm text-mute">
          <span className="font-medium text-brand">{article.category}</span>
          <span className="mx-2" aria-hidden="true">·</span>
          {article.readingMinutes} min read
        </p>
        <h3 className={`mt-2 font-semibold tracking-tight text-ink ${lead ? 'text-2xl md:text-[2rem] md:leading-[1.15]' : 'text-xl leading-snug'}`}>
          <Link href={`/blog/${article.slug}`} className="min-h-0 outline-none hover:text-brand focus-visible:underline">
            {article.title}
          </Link>
        </h3>
        <p className={`mt-2 text-ink-soft ${lead ? 'text-lg leading-relaxed' : 'text-[15px] leading-relaxed'}`}>
          {article.description}
        </p>
        {lead && <p className="mt-4 text-sm text-mute">{formatArticleDate(article.publishedAt)}</p>}
      </div>
    </article>
  );
}

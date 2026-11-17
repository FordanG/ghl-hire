import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RichText from '@/components/articles/RichText';
import ArticleCard from '@/components/articles/ArticleCard';
import SubscribeForm from '@/components/SubscribeForm';
import SuperClonerPanel from '@/components/SuperClonerPanel';
import { articles, formatArticleDate, getArticle, type ArticleBlock } from '@/content/articles';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: 'Guide not found' };

  const url = `https://ghlhire.com/blog/${article.slug}`;
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      type: 'article',
      publishedTime: article.publishedAt,
      images: [{ url: article.cover, width: 1280, height: 720, alt: article.coverAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [article.cover],
    },
  };
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case 'p':
      return <p><RichText text={block.text} /></p>;
    case 'h2':
      return (
        <h2 id={block.id} className="mt-12 mb-4 scroll-mt-24 text-[1.75rem] font-semibold leading-tight tracking-tight text-ink">
          {block.text}
        </h2>
      );
    case 'h3':
      return <h3 className="mt-8 mb-3 text-xl font-semibold tracking-tight text-ink">{block.text}</h3>;
    case 'ul':
      return (
        <ul className="mb-6 list-disc space-y-2 pl-6 marker:text-brand">
          {block.items.map((item, index) => (
            <li key={index}><RichText text={item} /></li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol className="mb-6 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-ink">
          {block.items.map((item, index) => (
            <li key={index}><RichText text={item} /></li>
          ))}
        </ol>
      );
    case 'callout':
      return (
        <aside className="my-8 border-l-4 border-gold bg-gold-soft px-5 py-4">
          {block.title && <p className="!mb-1 font-semibold text-ink">{block.title}</p>}
          <p className="!mb-0"><RichText text={block.text} /></p>
        </aside>
      );
    case 'table':
      return (
        <div className="my-8 overflow-x-auto rounded-lg border border-rule">
          <table className="w-full min-w-[480px] border-collapse text-left text-[15px]">
            <thead className="bg-surface">
              <tr>
                {block.head.map((cell) => (
                  <th key={cell} scope="col" className="px-4 py-3 font-semibold text-ink">{cell}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t border-rule align-top">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-3"><RichText text={cell} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const sections = article.body.filter((block) => block.type === 'h2');
  const more = articles.filter((item) => item.slug !== article.slug).slice(0, 3);
  // The Super Cloner card sits after the second section so it reads as a break, not a banner.
  const secondHeading = article.body.findIndex((block, index) => block.type === 'h2' && article.body.slice(0, index).filter((b) => b.type === 'h2').length === 2);
  const splitAt = secondHeading > 0 ? secondHeading : article.body.length;

  const url = `https://ghlhire.com/blog/${article.slug}`;
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: `https://ghlhire.com${article.cover}`,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    mainEntityOfPage: url,
    author: { '@type': 'Organization', name: 'GHL Hire', url: 'https://ghlhire.com' },
    publisher: {
      '@type': 'Organization',
      name: 'GHL Hire',
      logo: { '@type': 'ImageObject', url: 'https://ghlhire.com/icon.png' },
    },
  };
  const faqSchema = article.faq?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: article.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      }
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <Header />

      <main>
        <header className="page-wrap-narrow pt-10 md:pt-14">
          <p className="text-sm text-mute">
            <Link href="/blog" className="min-h-0 font-medium text-brand hover:underline">AI guides</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            {article.category}
          </p>
          <h1 className="display mt-4 text-[2.25rem] font-semibold md:text-5xl">{article.title}</h1>
          <p className="mt-5 text-xl leading-relaxed text-ink-soft">{article.description}</p>
          <p className="mt-5 text-sm text-mute">
            {formatArticleDate(article.publishedAt)}
            <span className="mx-2" aria-hidden="true">·</span>
            {article.readingMinutes} min read
          </p>
        </header>

        <div className="page-wrap mt-8 max-w-[1000px]">
          <Image
            src={article.cover}
            alt={article.coverAlt}
            width={1280}
            height={720}
            priority
            sizes="(max-width: 1000px) 100vw, 1000px"
            className="aspect-[16/9] w-full rounded-xl bg-ink object-cover"
          />
        </div>

        <div className="page-wrap-narrow mt-10">
          <section aria-labelledby="takeaways" className="rounded-xl bg-surface p-6 sm:p-7">
            <h2 id="takeaways" className="text-lg font-semibold tracking-tight">The short version</h2>
            <ul className="mt-3 space-y-2.5 text-[17px] leading-relaxed text-ink-soft">
              {article.keyTakeaways.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="hex mt-2 h-2.5 w-2.5 shrink-0 bg-brand" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {sections.length > 2 && (
            <nav aria-label="In this guide" className="mt-8">
              <h2 className="text-sm font-semibold text-ink">In this guide</h2>
              <ol className="mt-2 grid gap-x-8 sm:grid-cols-2">
                {sections.map((section) =>
                  section.type === 'h2' ? (
                    <li key={section.id}>
                      <a href={`#${section.id}`} className="inline-flex min-h-[40px] items-center text-[15px] text-brand hover:underline">
                        {section.text}
                      </a>
                    </li>
                  ) : null
                )}
              </ol>
            </nav>
          )}

          <div className="prose-article mt-10 text-[18px] leading-[1.7] text-ink-soft">
            {article.body.slice(0, splitAt).map((block, index) => (
              <Block key={index} block={block} />
            ))}
          </div>

          {splitAt < article.body.length && (
            <div className="my-12">
              <SuperClonerPanel variant="card" title="Building funnels for clients? Clone a proven one in one click." />
            </div>
          )}

          <div className="prose-article text-[18px] leading-[1.7] text-ink-soft">
            {article.body.slice(splitAt).map((block, index) => (
              <Block key={index} block={block} />
            ))}
          </div>

          {article.faq && article.faq.length > 0 && (
            <section aria-labelledby="faq" className="mt-14">
              <h2 id="faq" className="text-[1.75rem] font-semibold tracking-tight">Common questions</h2>
              <dl className="mt-5 divide-y divide-rule border-y border-rule">
                {article.faq.map((item) => (
                  <div key={item.q} className="py-5">
                    <dt className="text-lg font-semibold text-ink">{item.q}</dt>
                    <dd className="mt-2 text-[17px] leading-relaxed text-ink-soft">{item.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {article.sources && article.sources.length > 0 && (
            <section aria-labelledby="sources" className="mt-12">
              <h2 id="sources" className="text-sm font-semibold text-ink">Sources</h2>
              <ul className="mt-2 space-y-1 text-sm text-mute">
                {article.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline min-h-0 min-w-0 underline underline-offset-2 hover:text-ink">
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-14 rounded-xl border border-rule p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight">Put it to work</h2>
            <p className="mt-2 text-[17px] leading-relaxed text-ink-soft">
              See who is hiring for this right now, or get new GoHighLevel roles and guides by email once a week.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={article.relatedSearch ? `/jobs?q=${encodeURIComponent(article.relatedSearch)}` : '/jobs'}
                className="press inline-flex h-12 items-center rounded-md bg-brand px-5 text-base font-semibold text-white hover:bg-brand-dark"
              >
                Browse open GHL roles
              </Link>
              <Link
                href="/post-job"
                className="press inline-flex h-12 items-center rounded-md border border-rule px-5 text-base font-semibold text-ink hover:bg-surface"
              >
                Post a job free
              </Link>
            </div>
            <div className="mt-6 border-t border-rule pt-6">
              <SubscribeForm source={`article-${article.slug}`.slice(0, 60)} />
            </div>
          </section>
        </div>

        <section className="page-wrap py-16">
          <h2 className="text-2xl font-semibold tracking-tight">Keep reading</h2>
          <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((item) => (
              <ArticleCard key={item.slug} article={item} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

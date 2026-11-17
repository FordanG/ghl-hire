import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/articles/ArticleCard';
import SubscribeForm from '@/components/SubscribeForm';
import SuperClonerPanel from '@/components/SuperClonerPanel';
import { articles } from '@/content/articles';

export const metadata: Metadata = {
  title: 'AI guides for GoHighLevel professionals',
  description:
    'Practical guides on getting ahead in the AI world as a GoHighLevel specialist, freelancer or agency: the skills to learn, projects to build and services to sell.',
  alternates: { canonical: 'https://ghlhire.com/blog' },
  openGraph: {
    title: 'AI guides for GoHighLevel professionals | GHL Hire',
    description:
      'The skills to learn, projects to build and services to sell as AI changes GoHighLevel work.',
    url: 'https://ghlhire.com/blog',
    type: 'website',
  },
};

export default function BlogPage() {
  // Two large cards, then rows of three: eight guides leave no orphan card.
  const [first, second, ...rest] = articles;

  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <Header />

      <main>
        <section className="page-wrap pt-12 pb-10 md:pt-16">
          <h1 className="display max-w-3xl text-4xl font-semibold md:text-[3.25rem]">
            Get ahead in the AI world, one GoHighLevel skill at a time
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Plain guides for specialists, freelancers and agency owners: what to learn, what to build and what to sell now that AI sits inside HighLevel.
          </p>
        </section>

        <section className="page-wrap pb-14">
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2">
            <ArticleCard article={first} priority />
            <ArticleCard article={second} priority />
          </div>
        </section>

        <SuperClonerPanel />

        <section className="page-wrap py-14 md:py-16">
          <h2 className="sr-only">All guides</h2>
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>

        <section className="border-t border-rule bg-surface">
          <div className="page-wrap grid gap-6 py-10 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-12">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">New guides and new GHL roles, once a week</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                One short email with the latest openings on the board and the newest guide.
              </p>
            </div>
            <SubscribeForm source="blog-index" />
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

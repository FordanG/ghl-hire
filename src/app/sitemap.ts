import { MetadataRoute } from 'next';
import { articles } from '@/content/articles';
import { createPublicClient } from '@/lib/supabase/public';
import { generateJobSlug } from '@/lib/utils';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ghlhire.com';
  const now = new Date();

  let jobUrls: MetadataRoute.Sitemap = [];
  try {
    const { data: jobs } = await createPublicClient()
      .from('jobs')
      .select('id, updated_at, title')
      .eq('status', 'active')
      .order('updated_at', { ascending: false })
      .limit(5000);

    jobUrls = (jobs || []).map((job) => ({
      // Must match the canonical URL on the job page.
      url: `${baseUrl}/jobs/${generateJobSlug(job.title, job.id)}`,
      lastModified: new Date(job.updated_at),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Sitemap: could not load jobs', error);
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/jobs`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/employers`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/featured`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const articleUrls: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(`${article.publishedAt}T00:00:00Z`),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticPages, ...articleUrls, ...jobUrls];
}

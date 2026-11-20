import { articles } from '@/content/articles';
import { createPublicClient } from '@/lib/supabase/public';
import { generateJobSlug } from '@/lib/utils';
import { CONTACT_EMAIL, SITE_URL } from '@/lib/site';

// llms.txt: a plain-text guide to the site for AI assistants and answer
// engines. Rebuilt hourly so the list of open roles stays current.
export const revalidate = 3600;

export async function GET() {
  let jobLines: string[] = [];
  try {
    const { data: jobs } = await createPublicClient()
      .from('jobs')
      .select('id, title, location, remote, job_type')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(100);
    jobLines = (jobs || []).map((job) => {
      const where = job.remote ? 'Remote' : job.location;
      const detail = [job.job_type, where].filter(Boolean).join(', ');
      return `- [${job.title}](${SITE_URL}/jobs/${generateJobSlug(job.title, job.id)})${detail ? `: ${detail}` : ''}`;
    });
  } catch (error) {
    console.error('llms.txt: could not load jobs', error);
  }

  const body = [
    '# GHL Hire',
    '',
    '> GHL Hire is a free job board for GoHighLevel (HighLevel, GHL) work: automation specialists, funnel builders, Voice AI builders, virtual assistants and developers. Posting a job is free and applying is free.',
    '',
    'Listings include roles posted directly by employers and roles curated from other sources. A curated listing links to the original posting, which is where you apply. Employers can pay to feature a listing at the top of the board.',
    '',
    '## Main pages',
    '',
    `- [Open GoHighLevel jobs](${SITE_URL}/jobs): the full, searchable list of open roles`,
    `- [For employers](${SITE_URL}/employers): how to post a GoHighLevel job for free`,
    `- [Featured listings](${SITE_URL}/featured): paid placement at the top of the board`,
    `- [Blog](${SITE_URL}/blog): career and hiring guides for GoHighLevel work`,
    `- [Contact](${SITE_URL}/contact): ${CONTACT_EMAIL}`,
    '',
    '## Guides',
    '',
    ...articles.map((article) => `- [${article.title}](${SITE_URL}/blog/${article.slug}): ${article.description}`),
    '',
    ...(jobLines.length ? ['## Open roles', '', ...jobLines, ''] : []),
    '## Policies',
    '',
    `- [Terms](${SITE_URL}/terms)`,
    `- [Privacy](${SITE_URL}/privacy)`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

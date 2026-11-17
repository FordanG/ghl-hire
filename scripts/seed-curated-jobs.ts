/**
 * Inserts curated listings (real roles found on employer hiring pages) from a
 * JSON file. Idempotent: a role whose apply_url is already on the board is
 * skipped.
 *
 *   npx tsx scripts/seed-curated-jobs.ts supabase/seed/curated-jobs-2026-11-18.json
 */
import { readFileSync } from 'node:fs';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

interface CuratedJob {
  title: string;
  company_name: string;
  company_website: string | null;
  apply_url: string;
  source_name: string;
  location: string;
  remote: boolean;
  job_type: string;
  experience_level: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  salary_period: 'year' | 'month' | 'hour' | null;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  posted_date: string | null;
}

const bullets = (items: string[]) => items.map((item) => `- ${item}`).join('\n');

async function main() {
  const file = process.argv[2];
  if (!file) throw new Error('Pass the JSON file path.');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  const jobs: CuratedJob[] = JSON.parse(readFileSync(file, 'utf8'));
  let added = 0;

  for (const job of jobs) {
    const { data: existing } = await supabase.from('jobs').select('id').eq('apply_url', job.apply_url).limit(1);
    if (existing && existing.length > 0) continue;

    // Pay is only shown when the posting states the period (year, month, hour).
    const hasPay = Boolean(job.salary_period) && (job.salary_min !== null || job.salary_max !== null);

    const { error } = await supabase.from('jobs').insert({
      title: job.title,
      description: job.summary,
      requirements: bullets(job.requirements),
      benefits: bullets(job.responsibilities), // shown as "What you will do" on curated listings
      location: job.location,
      remote: job.remote,
      job_type: job.job_type,
      experience_level: job.experience_level,
      salary_min: hasPay ? job.salary_min : null,
      salary_max: hasPay ? job.salary_max : null,
      salary_currency: job.salary_currency || 'USD',
      salary_period: hasPay ? job.salary_period : 'year',
      apply_url: job.apply_url,
      source_name: job.source_name,
      external_company_name: job.company_name,
      external_company_url: job.company_website,
      status: 'active',
      ...(job.posted_date ? { created_at: new Date(job.posted_date).toISOString() } : {}),
    });

    if (error) {
      console.error(`FAILED ${job.title}: ${error.message}`);
    } else {
      added += 1;
    }
  }

  console.log(`Added ${added} of ${jobs.length} listings.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

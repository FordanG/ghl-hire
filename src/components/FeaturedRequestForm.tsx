'use client';

import { useState } from 'react';
import { submitSiteForm } from '@/lib/site-forms';

const field =
  'h-12 w-full rounded-md border border-rule bg-white px-3 text-base text-ink outline-none transition-colors placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/30';
const label = 'mb-1.5 block text-[15px] font-medium text-ink';

type State = 'idle' | 'sending' | 'done' | 'error';

export default function FeaturedRequestForm() {
  const [form, setForm] = useState({ name: '', email: '', company: '', job: '', startDate: '', notes: '', website: '' });
  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('');

  const update = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setState('sending');
    setMessage('');
    const error = await submitSiteForm('featured', form);
    if (error) {
      setState('error');
      setMessage(error);
      return;
    }
    setState('done');
  }

  if (state === 'done') {
    return (
      <div role="status" className="rounded-xl border border-rule bg-white p-6 sm:p-8">
        <h3 className="text-2xl font-semibold tracking-tight text-ink">Request received</h3>
        <p className="mt-2 text-[17px] leading-relaxed text-ink-soft">
          We will email {form.email} with the rate and a payment link. Payment is through Wise for now. Your listing is featured as soon as the payment arrives.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-rule bg-white p-6 sm:p-8">
      <input type="text" name="website" value={form.website} onChange={update('website')} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fr-name" className={label}>Your name</label>
          <input id="fr-name" required maxLength={200} autoComplete="name" value={form.name} onChange={update('name')} className={field} />
        </div>
        <div>
          <label htmlFor="fr-email" className={label}>Email for the payment link</label>
          <input id="fr-email" type="email" required maxLength={254} autoComplete="email" value={form.email} onChange={update('email')} className={field} placeholder="you@company.com" />
        </div>
        <div>
          <label htmlFor="fr-company" className={label}>Company</label>
          <input id="fr-company" required maxLength={200} autoComplete="organization" value={form.company} onChange={update('company')} className={field} />
        </div>
        <div>
          <label htmlFor="fr-start" className={label}>Start date <span className="font-normal text-mute">(optional)</span></label>
          <input id="fr-start" type="date" value={form.startDate} onChange={update('startDate')} className={field} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="fr-job" className={label}>Job title or link to the listing</label>
          <input id="fr-job" required maxLength={500} value={form.job} onChange={update('job')} className={field} placeholder="https://ghlhire.com/jobs/..." />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="fr-notes" className={label}>Anything else <span className="font-normal text-mute">(optional)</span></label>
          <textarea id="fr-notes" rows={3} maxLength={2000} value={form.notes} onChange={update('notes')} className={`${field} h-auto py-3`} />
        </div>
      </div>

      <p className="mt-5 rounded-md bg-gold-soft px-4 py-3 text-[15px] leading-relaxed text-ink">
        After you send this, we email you the rate and a payment link. Payment is through Wise for now, while we set up more payment methods. Nothing is charged until you pay that link.
      </p>

      {state === 'error' && <p role="alert" className="mt-3 text-[15px] text-red-600">{message}</p>}

      <button
        type="submit"
        disabled={state === 'sending'}
        className="press mt-5 inline-flex h-12 items-center rounded-md bg-brand px-6 text-base font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {state === 'sending' ? 'Sending...' : 'Request a featured listing'}
      </button>
    </form>
  );
}

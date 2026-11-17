'use client';

import { useState } from 'react';

interface SubscribeFormProps {
  /** Where the signup happened, stored with the subscriber. */
  source: string;
  tone?: 'light' | 'dark';
  buttonLabel?: string;
  /** Stack the field above the button (narrow columns). */
  stacked?: boolean;
}

export default function SubscribeForm({ source, tone = 'light', buttonLabel = 'Get the weekly email', stacked = false }: SubscribeFormProps) {
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState<'jobseeker' | 'employer'>('jobseeker');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const dark = tone === 'dark';

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setState('sending');
    setMessage('');
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, interest, source }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setState('error');
        setMessage(data.error || 'That did not go through. Please try again.');
        return;
      }
      setState('done');
    } catch {
      setState('error');
      setMessage('That did not go through. Please try again.');
    }
  }

  if (state === 'done') {
    return (
      <p role="status" className={`rounded-md px-4 py-3 text-[15px] font-medium ${dark ? 'bg-white/10 text-white' : 'bg-brand-soft text-ink'}`}>
        You are on the list. The next email goes out with this week&apos;s new roles.
      </p>
    );
  }

  const radio = (value: 'jobseeker' | 'employer', label: string) => (
    <label className={`inline-flex min-h-[44px] cursor-pointer items-center gap-2 text-[15px] ${dark ? 'text-slate-200' : 'text-ink-soft'}`}>
      <input
        type="radio"
        name={`interest-${source}`}
        value={value}
        checked={interest === value}
        onChange={() => setInterest(value)}
        className="h-4 w-4 accent-[#2563eb]"
      />
      {label}
    </label>
  );

  return (
    <form onSubmit={handleSubmit} noValidate={false}>
      <div className={`flex flex-col gap-3 ${stacked ? '' : 'sm:flex-row'}`}>
        <label className="sr-only" htmlFor={`email-${source}`}>Email address</label>
        <input
          id={`email-${source}`}
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={`h-12 w-full min-w-0 shrink-0 rounded-md border ${stacked ? '' : 'sm:flex-1 sm:shrink'} px-4 text-base outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/30 ${
            dark ? 'border-white/20 bg-white text-ink placeholder:text-slate-400' : 'border-rule bg-white text-ink placeholder:text-slate-400'
          }`}
        />
        <button
          type="submit"
          disabled={state === 'sending'}
          className={`press h-12 shrink-0 rounded-md px-5 text-base font-semibold transition-colors disabled:opacity-60 ${
            dark ? 'bg-gold text-ink hover:bg-white' : 'bg-brand text-white hover:bg-brand-dark'
          }`}
        >
          {state === 'sending' ? 'Adding you...' : buttonLabel}
        </button>
      </div>
      <fieldset className="mt-2 flex flex-wrap gap-x-6">
        <legend className="sr-only">I am</legend>
        {radio('jobseeker', 'I am looking for work')}
        {radio('employer', 'I am hiring')}
      </fieldset>
      {state === 'error' && (
        <p role="alert" className={`mt-1 text-sm ${dark ? 'text-red-300' : 'text-red-600'}`}>{message}</p>
      )}
      <p className={`mt-1 text-sm ${dark ? 'text-slate-400' : 'text-mute'}`}>
        One email a week. Unsubscribe any time.
      </p>
    </form>
  );
}

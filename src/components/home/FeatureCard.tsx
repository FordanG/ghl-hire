import type { LucideIcon } from 'lucide-react';

export type FeatureAudience = 'employer' | 'talent';

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  audience: FeatureAudience;
  /** Renders the card in a muted, non-interactive "teaser" style. */
  comingSoon?: boolean;
}

const AUDIENCE_BADGE: Record<FeatureAudience, { label: string; className: string }> = {
  employer: { label: 'For employers', className: 'bg-blue-50 text-blue-700 ring-blue-100' },
  talent: { label: 'For talent', className: 'bg-indigo-50 text-indigo-700 ring-indigo-100' },
};

const AUDIENCE_ICON: Record<FeatureAudience, string> = {
  employer: 'bg-blue-50 text-blue-600',
  talent: 'bg-indigo-50 text-indigo-600',
};

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  audience,
  comingSoon = false,
}: Feature) {
  if (comingSoon) {
    return (
      <div className="flex h-full flex-col gap-4 rounded-xl border border-dashed border-gray-300 bg-gray-50/70 p-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-white text-gray-400 ring-1 ring-inset ring-gray-200">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-100">
            Coming soon
          </span>
        </div>
        <div>
          <h3 className="mb-1 text-base font-semibold text-gray-500">{title}</h3>
          <p className="text-sm leading-relaxed text-gray-400">{description}</p>
        </div>
      </div>
    );
  }

  const badge = AUDIENCE_BADGE[audience];

  return (
    <div className="hover-lift flex h-full flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div
          className={`inline-flex h-11 w-11 items-center justify-center rounded-lg ${AUDIENCE_ICON[audience]}`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>
      <div>
        <h3 className="mb-1 text-base font-semibold text-gray-900">{title}</h3>
        <p className="text-sm leading-relaxed text-gray-500">{description}</p>
      </div>
    </div>
  );
}

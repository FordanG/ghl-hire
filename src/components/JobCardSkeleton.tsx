export default function JobCardSkeleton() {
  return (
    <div className="flex h-full animate-pulse flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header: icon + title/company + save */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-1 items-start gap-3">
          <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-gray-200"></div>
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-4 w-3/4 rounded bg-gray-200"></div>
            <div className="h-3 w-1/3 rounded bg-gray-200"></div>
          </div>
        </div>
        <div className="h-8 w-8 flex-shrink-0 rounded-lg bg-gray-200"></div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <div className="h-6 w-20 rounded-full bg-gray-200"></div>
        <div className="h-6 w-16 rounded-full bg-gray-200"></div>
        <div className="h-6 w-24 rounded-full bg-gray-200"></div>
      </div>

      {/* Description */}
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-full rounded bg-gray-200"></div>
        <div className="h-3.5 w-full rounded bg-gray-200"></div>
        <div className="h-3.5 w-2/3 rounded bg-gray-200"></div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-4">
        <div className="h-4 w-28 rounded bg-gray-200"></div>
        <div className="h-10 w-24 rounded-md bg-gray-200"></div>
      </div>
    </div>
  );
}

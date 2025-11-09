export default function JobCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="bg-gray-200 rounded-full w-10 h-10"></div>
        <div className="bg-gray-200 h-6 w-48 rounded"></div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="bg-gray-200 h-5 w-32 rounded"></div>
        <div className="bg-gray-200 h-5 w-24 rounded"></div>
        <div className="bg-gray-200 h-5 w-28 rounded"></div>
      </div>

      <div className="space-y-2">
        <div className="bg-gray-200 h-4 w-full rounded"></div>
        <div className="bg-gray-200 h-4 w-full rounded"></div>
        <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
      </div>

      <div className="flex items-center justify-between">
        <div className="bg-gray-200 h-5 w-32 rounded"></div>
        <div className="bg-gray-200 h-9 w-24 rounded-md"></div>
      </div>
    </div>
  );
}

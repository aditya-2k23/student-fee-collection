export function LoadingState() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary skeleton */}
      <div className="bg-surface-elevated border border-border rounded-md shadow-2xs overflow-hidden">
        <div className="bg-surface-subtle border-b border-border px-4 py-2 flex items-center justify-between">
          <div className="skeleton h-3 w-40" />
          <div className="skeleton h-3 w-24" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
          <div className="col-span-1 sm:col-span-2 p-5">
            <div className="skeleton h-3 w-36 mb-3" />
            <div className="skeleton h-10 w-52 mb-2" />
            <div className="skeleton h-3 w-44" />
          </div>
          <div className="p-5">
            <div className="skeleton h-3 w-28 mb-3" />
            <div className="skeleton h-9 w-20 mb-2" />
            <div className="skeleton h-3 w-24" />
          </div>
          <div className="p-5">
            <div className="skeleton h-3 w-28 mb-3" />
            <div className="skeleton h-4 w-36 mt-2 mb-2" />
            <div className="skeleton h-3 w-24" />
          </div>
        </div>
      </div>

      {/* Filter skeleton */}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="skeleton h-8 rounded-md"
            style={{ width: `${70 + i * 16}px` }}
          />
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-surface border border-border rounded-md overflow-hidden">
        <div className="h-9 bg-surface-subtle border-b border-border" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3 border-b border-border/60 last:border-0"
          >
            <div className="skeleton h-4 w-4 rounded-xs" />
            <div className="skeleton h-4 flex-1 max-w-44" />
            <div className="skeleton h-4 w-12" />
            <div className="skeleton h-4 w-28 hidden xl:block" />
            <div className="skeleton h-4 w-20 ml-auto" />
            <div className="skeleton h-5 w-24 rounded-xs" />
            <div className="skeleton h-4 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}

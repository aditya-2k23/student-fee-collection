export function LoadingState() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-1 sm:col-span-2 bg-surface-elevated border border-border rounded-xl p-5">
          <div className="skeleton h-4 w-32 mb-3" />
          <div className="skeleton h-10 w-48 mb-2" />
          <div className="skeleton h-3 w-40" />
        </div>
        <div className="bg-surface-elevated border border-border rounded-xl p-5">
          <div className="skeleton h-4 w-28 mb-3" />
          <div className="skeleton h-10 w-16 mb-2" />
          <div className="skeleton h-3 w-24" />
        </div>
        <div className="bg-surface-elevated border border-border rounded-xl p-5">
          <div className="skeleton h-4 w-24 mb-3" />
          <div className="skeleton h-4 w-36 mt-3 mb-2" />
          <div className="skeleton h-3 w-28" />
        </div>
      </div>

      {/* Filter skeleton */}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton h-9 rounded-lg" style={{ width: `${60 + i * 16}px` }} />
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-surface-elevated border border-border rounded-xl overflow-hidden">
        <div className="h-10 bg-surface-hover border-b border-border" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-0">
            <div className="skeleton h-4 w-4 rounded" />
            <div className="skeleton h-4 flex-1 max-w-40" />
            <div className="skeleton h-4 w-12" />
            <div className="skeleton h-4 w-28 hidden xl:block" />
            <div className="skeleton h-4 w-20 ml-auto" />
            <div className="skeleton h-5 w-20 rounded-full" />
            <div className="skeleton h-4 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}

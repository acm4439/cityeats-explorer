export function SkeletonCard() {
  return (
    <div className="flex h-full min-h-[28rem] flex-col overflow-hidden rounded-xl border border-surface-border bg-card shadow-sm">
      <div className="h-44 shrink-0 animate-pulse bg-muted md:h-48" />
      <div className="flex flex-1 flex-col space-y-4 p-5">
        <div className="space-y-2">
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="h-6 max-w-[220px] w-[85%] animate-pulse rounded bg-muted" />
        </div>
        <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
        <div className="min-h-[2.75rem] space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
        </div>
        <div className="mt-auto space-y-3 rounded-lg bg-muted/40 p-3">
          <div className="h-3 w-16 animate-pulse rounded bg-muted/80" />
          <div className="h-4 w-full animate-pulse rounded bg-muted/80" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted/80" />
        </div>
        <div className="h-8 w-full animate-pulse rounded bg-muted/60" />
      </div>
    </div>
  );
}

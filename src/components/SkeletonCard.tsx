import { cn } from "@/lib/utils";

export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-surface-border bg-surface p-6 space-y-4 card-noise card-top-highlight">
      <div className="flex justify-between">
        <div className={cn("h-5 w-40 rounded bg-secondary animate-shimmer")} style={{ backgroundSize: "200% 100%", backgroundImage: "linear-gradient(90deg, hsl(var(--secondary)) 25%, hsl(var(--surface-hover)) 50%, hsl(var(--secondary)) 75%)" }} />
        <div className="h-5 w-16 rounded-full bg-secondary animate-shimmer" style={{ backgroundSize: "200% 100%", backgroundImage: "linear-gradient(90deg, hsl(var(--secondary)) 25%, hsl(var(--surface-hover)) 50%, hsl(var(--secondary)) 75%)" }} />
      </div>
      <div className="h-4 w-56 rounded bg-secondary animate-shimmer" style={{ backgroundSize: "200% 100%", backgroundImage: "linear-gradient(90deg, hsl(var(--secondary)) 25%, hsl(var(--surface-hover)) 50%, hsl(var(--secondary)) 75%)" }} />
      <div className="flex justify-between">
        <div className="h-5 w-10 rounded bg-secondary animate-shimmer" style={{ backgroundSize: "200% 100%", backgroundImage: "linear-gradient(90deg, hsl(var(--secondary)) 25%, hsl(var(--surface-hover)) 50%, hsl(var(--secondary)) 75%)" }} />
        <div className="h-4 w-32 rounded bg-secondary animate-shimmer" style={{ backgroundSize: "200% 100%", backgroundImage: "linear-gradient(90deg, hsl(var(--secondary)) 25%, hsl(var(--surface-hover)) 50%, hsl(var(--secondary)) 75%)" }} />
      </div>
    </div>
  );
}

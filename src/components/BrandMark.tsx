import { UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

/** Small fork-and-knife mark used in place of a raster logo. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md border border-surface-border bg-surface text-primary",
        className,
      )}
      aria-hidden
    >
      <UtensilsCrossed className="size-[14px] md:size-4" strokeWidth={2.25} />
    </span>
  );
}

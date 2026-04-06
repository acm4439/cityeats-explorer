import { Link } from "react-router-dom";
import { ChevronRight, MapPin, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Restaurant } from "@/types/restaurant";

function ratingStyles(rating: number) {
  if (rating >= 4) return "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80";
  if (rating >= 3) return "bg-amber-50 text-amber-900 ring-1 ring-amber-200/80";
  return "bg-stone-100 text-stone-600 ring-1 ring-stone-200/90";
}

const cuisineStyles: Record<string, string> = {
  Italian: "bg-rose-50 text-rose-900 ring-rose-200/80",
  Japanese: "bg-red-50 text-red-900 ring-red-200/70",
  Filipino: "bg-amber-50 text-amber-950 ring-amber-200/80",
  Mexican: "bg-orange-50 text-orange-950 ring-orange-200/80",
  American: "bg-teal-50 text-teal-900 ring-teal-200/80",
  Thai: "bg-emerald-50 text-emerald-900 ring-emerald-200/80",
  Chinese: "bg-rose-50 text-rose-950 ring-rose-200/70",
  French: "bg-violet-50 text-violet-950 ring-violet-200/80",
  Indian: "bg-amber-50 text-amber-950 ring-amber-200/70",
  Steakhouses: "bg-stone-100 text-stone-800 ring-stone-200/90",
};

function getCuisineStyles(cuisine: string) {
  return cuisineStyles[cuisine] ?? "bg-primary/[0.07] text-foreground ring-primary/15";
}

function formatReviewCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k Yelp reviews`;
  return `${n} Yelp reviews`;
}

function hasUsableDescription(text: string | undefined): boolean {
  if (!text?.trim()) return false;
  const t = text.trim();
  if (t === "No description available") return false;
  return true;
}

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const { id, name, cuisine, rating, address, reviewCount, shortDescription, imageUrl } = restaurant;
  const showDescription = hasUsableDescription(shortDescription);

  return (
    <Link
      to={`/restaurant/${id}`}
      className={cn(
        "group relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-surface-border bg-card p-0 shadow-sm",
        "transition-all duration-300 card-noise card-top-highlight",
        "hover:border-primary/35 hover:shadow-lg hover:-translate-y-1",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
    >
      {/* Fixed image height so every card lines up; object-cover fills the frame */}
      <div className="relative h-44 w-full shrink-0 bg-muted md:h-48">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted via-muted/80 to-primary/[0.08]"
            aria-hidden
          >
            <UtensilsCrossed className="size-10 text-muted-foreground/50" strokeWidth={1.5} />
          </div>
        )}
        {rating != null ? (
          <div className="absolute right-2 top-2">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums shadow-sm backdrop-blur-sm",
                ratingStyles(rating),
                "bg-white/95 ring-1 ring-black/5",
              )}
            >
              ★ {rating.toFixed(1)}
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Restaurant</p>
            <h3 className="text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary line-clamp-2">
              {name}
            </h3>
          </div>
          {rating == null ? (
            <div className="flex shrink-0 flex-col items-start gap-0.5 sm:items-end">
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Yelp rating</span>
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border">No rating yet</span>
            </div>
          ) : null}
        </div>

        <span
          className={cn(
            "mt-3 w-fit rounded-full px-2.5 py-1 text-xs font-medium ring-1",
            getCuisineStyles(cuisine),
          )}
        >
          {cuisine}
        </span>

        {reviewCount != null && reviewCount > 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">{formatReviewCount(reviewCount)}</p>
        ) : null}

        {showDescription ? (
          <div className="mt-2 flex items-stretch gap-2.5">
            <div className="w-[3px] shrink-0 rounded-full bg-accent/70" aria-hidden />
            <p className="min-w-0 flex-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{shortDescription}</p>
          </div>
        ) : null}

        <div className="mt-4 flex gap-2.5 rounded-lg bg-muted/50 px-3 py-2.5 text-sm text-foreground">
          <MapPin size={17} className="mt-0.5 shrink-0 text-primary" aria-hidden />
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Address</p>
            <p className="line-clamp-3 leading-snug">{address}</p>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-surface-border pt-4 text-sm font-medium text-primary">
          <span>Open full details</span>
          <ChevronRight size={18} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
        </div>
      </div>
    </Link>
  );
}

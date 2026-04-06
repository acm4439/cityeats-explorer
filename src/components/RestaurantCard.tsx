import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Restaurant } from "@/data/mockRestaurants";

function ratingColor(rating: number) {
  if (rating >= 4) return "bg-success/15 text-success";
  if (rating >= 3) return "bg-warning/15 text-warning";
  return "bg-muted text-muted-foreground";
}

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const { id, name, cuisine, rating, address, coordinates } = restaurant;
  return (
    <Link
      to={`/restaurant/${id}`}
      className={cn(
        "group block rounded-lg border border-surface-border bg-surface p-5",
        "transition-all duration-200",
        "hover:border-border-hover hover:bg-surface-hover"
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-lg font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
          {name}
        </h3>
        <span className="shrink-0 text-xs font-mono px-2 py-1 rounded-full bg-secondary text-primary border border-surface-border">
          {cuisine}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-3">
        <MapPin size={14} className="text-primary/60 shrink-0" />
        <span className="truncate">{address}</span>
      </div>

      <div className="flex items-center justify-between">
        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded", ratingColor(rating))}>
          {rating.toFixed(1)}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {Math.abs(coordinates.lat).toFixed(4)}&deg; {coordinates.lat >= 0 ? "N" : "S"},{" "}
          {Math.abs(coordinates.lng).toFixed(4)}&deg; {coordinates.lng >= 0 ? "E" : "W"}
        </span>
      </div>
    </Link>
  );
}

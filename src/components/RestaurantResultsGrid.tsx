import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  /** "loading" matches Explore skeleton layout */
  variant?: "default" | "loading";
};

/**
 * Responsive restaurant grid: on large screens, every middle column card is offset downward for a staggered rhythm.
 */
export function RestaurantResultsGrid({ children, variant = "default" }: Props) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-6 lg:pb-12",
        variant === "loading" && "lg:pb-8",
      )}
    >
      {children}
    </div>
  );
}

/** Wrapper for each cell so cards stretch to row height and the stagger applies to the whole card. */
export function RestaurantGridCell({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        "h-full min-h-0 transition-transform duration-300 ease-out",
        "lg:[&:nth-child(3n+2)]:translate-y-8",
        "lg:[&:nth-child(3n+2)]:hover:z-10",
      )}
    >
      {children}
    </div>
  );
}

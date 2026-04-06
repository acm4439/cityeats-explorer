import { BrandMark } from "@/components/BrandMark";

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-background">
      <div className="container flex flex-col gap-6 py-10 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <BrandMark className="size-5" />
            <span className="font-bold text-foreground">CityEats</span>
            <span className="font-bold text-gradient-amber">Explorer</span>
          </div>
          <p className="leading-relaxed text-muted-foreground">Discover restaurants worth going to, in any city.</p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:text-right">
          <p className="text-xs text-muted-foreground">Powered by Yelp</p>
          <p className="text-xs text-muted-foreground">&copy; 2026 CityEats Explorer</p>
        </div>
      </div>
    </footer>
  );
}

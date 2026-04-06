import { Fragment, useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, ArrowRight, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RestaurantCard from "@/components/RestaurantCard";
import { RestaurantGridCell, RestaurantResultsGrid } from "@/components/RestaurantResultsGrid";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { searchRestaurants } from "@/services/yelp";
import type { Restaurant } from "@/types/restaurant";
import { cn, decodeCityParam, toDisplayCity } from "@/lib/utils";

const PAGE_SIZE = 12;

type SortMode = "match" | "rating" | "az";

const sortOptions: { value: SortMode; label: string }[] = [
  { value: "match", label: "Best Match" },
  { value: "rating", label: "Highest Rated" },
  { value: "az", label: "A\u2013Z" },
];

/** Page indices to show when there are many pages (current ± window, plus first/last). */
function getVisiblePageNumbers(totalPages: number, current: number): number[] {
  if (totalPages <= 9) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const set = new Set<number>([1, totalPages, current]);
  for (let d = -2; d <= 2; d++) {
    const p = current + d;
    if (p >= 1 && p <= totalPages) set.add(p);
  }
  return [...set].sort((a, b) => a - b);
}

type ResultsPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  /** Distinct label for accessibility when two pagers are on the page */
  labelSuffix: string;
};

function ResultsPagination({ currentPage, totalPages, onPageChange, className, labelSuffix }: ResultsPaginationProps) {
  const pageNums = useMemo(() => getVisiblePageNumbers(totalPages, currentPage), [totalPages, currentPage]);

  return (
    <nav
      className={cn("flex flex-col gap-3", className)}
      aria-label={`Restaurant results pagination${labelSuffix ? ` — ${labelSuffix}` : ""}`}
    >
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 gap-0.5 px-2 text-xs font-medium"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        >
          <ChevronLeft className="size-3.5 shrink-0" />
          Prev
        </Button>

        <div className="flex flex-wrap items-center justify-center gap-0.5 px-0.5">
          {pageNums.map((p, idx) => (
            <Fragment key={p}>
              {idx > 0 && pageNums[idx] - pageNums[idx - 1] > 1 ? (
                <span className="select-none px-0.5 text-xs text-muted-foreground" aria-hidden>
                  …
                </span>
              ) : null}
              <Button
                type="button"
                variant={p === currentPage ? "default" : "outline"}
                size="sm"
                className="h-7 min-w-7 px-1.5 text-xs font-semibold"
                onClick={() => onPageChange(p)}
                aria-label={`Go to page ${p}`}
                aria-current={p === currentPage ? "page" : undefined}
              >
                {p}
              </Button>
            </Fragment>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 gap-0.5 px-2 text-xs font-medium"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        >
          Next
          <ChevronRight className="size-3.5 shrink-0" />
        </Button>
      </div>
      <p className="text-center text-[11px] text-muted-foreground sm:text-xs">
        Page <span className="font-medium text-foreground">{currentPage}</span> of {totalPages}
      </p>
    </nav>
  );
}

export default function Explore() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const cityParam = decodeCityParam(params.get("city"));
  const displayCity = cityParam ? toDisplayCity(cityParam) : "";

  const [searchInput, setSearchInput] = useState(() => decodeCityParam(params.get("city")));
  const [results, setResults] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortMode>("match");
  const [cityValidationError, setCityValidationError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const resultsAnchorRef = useRef<HTMLDivElement>(null);
  const paginationScrollRef = useRef<number | null>(null);

  useEffect(() => {
    setSearchInput(cityParam || "");
  }, [cityParam]);

  useEffect(() => {
    if (!cityParam) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    setResults([]);
    setLoading(true);
    setError(null);

    let cancelled = false;
    searchRestaurants(cityParam)
      .then((list) => {
        if (!cancelled) setResults(list);
      })
      .catch(() => {
        if (!cancelled) setError("Something went wrong. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [cityParam]);

  useEffect(() => {
    paginationScrollRef.current = null;
    setPage(1);
  }, [cityParam, sort]);

  const sortedResults = useMemo(() => {
    if (sort === "rating") {
      return [...results].sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
    }
    if (sort === "az") {
      return [...results].sort((a, b) => a.name.localeCompare(b.name));
    }
    return results;
  }, [results, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedResults.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const paginatedResults = sortedResults.slice(pageStart, pageStart + PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    if (paginationScrollRef.current === null) {
      paginationScrollRef.current = page;
      return;
    }
    if (paginationScrollRef.current === page) return;
    paginationScrollRef.current = page;
    if (!cityParam || sortedResults.length === 0) return;
    resultsAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page, cityParam, sortedResults.length]);

  const handleSearch = () => {
    const v = searchInput.trim();
    if (!v) {
      setCityValidationError("Please enter a city name");
      return;
    }
    setCityValidationError(null);
    navigate(`/explore?city=${encodeURIComponent(v)}`);
  };

  return (
    <div className="min-h-screen flex flex-col animate-page-enter">
      <Navbar />
      <main className="flex-1 pt-14">
        {/* Fixed under navbar so it stays visible while scrolling */}
        <div className="fixed top-14 left-0 right-0 z-40 border-b border-surface-border bg-background/92 backdrop-blur-md shadow-sm">
          <div className="container py-3">
            <div className="relative w-full max-w-5xl lg:max-w-6xl">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  if (cityValidationError) setCityValidationError(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search a city..."
                className="w-full h-10 rounded-full bg-card border border-surface-border pl-10 pr-24 text-sm text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:border-border-hover transition-all focus:shadow-[0_0_0_3px_hsla(18,72%,48%,0.2)]"
              />
              <button
                onClick={handleSearch}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-4 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1 hover:opacity-90 transition-opacity btn-press"
              >
                Search <ArrowRight size={12} />
              </button>
            </div>
            {cityValidationError ? <p className="text-sm text-destructive mt-2 ml-1">{cityValidationError}</p> : null}
          </div>
        </div>

        {/* Offset below fixed search (input row + padding + optional validation line) */}
        <div className="container py-8 pt-28">
          {error ? (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          {/* Header & filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {cityParam ? `Restaurants in ${displayCity}` : "Search by city"}
              </h1>
              {cityParam && !loading && !error && sortedResults.length > 0 ? (
                <p className="text-sm text-muted-foreground mt-1">
                  {sortedResults.length <= PAGE_SIZE ? (
                    <>
                      Showing {sortedResults.length} restaurant{sortedResults.length !== 1 ? "s" : ""} in {displayCity}
                    </>
                  ) : (
                    <>
                      Showing {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, sortedResults.length)} of {sortedResults.length}{" "}
                      restaurant{sortedResults.length !== 1 ? "s" : ""} in {displayCity} (page {safePage} of {totalPages})
                    </>
                  )}
                </p>
              ) : cityParam && !loading && !error ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  Showing 0 restaurants in {displayCity}
                </p>
              ) : null}
            </div>
            <div className="flex gap-2">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSort(opt.value)}
                  className={cn(
                    "text-xs px-3 py-1.5 rounded-full border transition-colors btn-press",
                    sort === opt.value
                      ? "bg-accent text-background border-accent"
                      : "bg-surface border-surface-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {!cityParam ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Search size={40} className="text-muted-foreground mb-4" />
              <h2 className="text-lg font-semibold text-foreground mb-1">Enter a city to explore</h2>
              <p className="text-sm text-muted-foreground">Use the search bar above or pick a popular city from the home page.</p>
            </div>
          ) : loading ? (
            <RestaurantResultsGrid variant="loading">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <RestaurantGridCell key={i}>
                  <SkeletonCard />
                </RestaurantGridCell>
              ))}
            </RestaurantResultsGrid>
          ) : error ? null : sortedResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Search size={40} className="text-muted-foreground mb-4" />
              <h2 className="text-lg font-semibold text-foreground mb-1">No restaurants found in {displayCity}</h2>
              <p className="text-sm text-muted-foreground">Try another city like Manila, Tokyo, or New York.</p>
            </div>
          ) : (
            <>
              <div ref={resultsAnchorRef} className="scroll-mt-36" aria-hidden />
              {totalPages > 1 ? (
                <ResultsPagination
                  currentPage={safePage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  labelSuffix="top"
                  className="mb-8 border-b border-surface-border pb-8"
                />
              ) : null}
              <RestaurantResultsGrid>
                {paginatedResults.map((r) => (
                  <RestaurantGridCell key={r.id}>
                    <RestaurantCard restaurant={r} />
                  </RestaurantGridCell>
                ))}
              </RestaurantResultsGrid>
              {totalPages > 1 ? (
                <ResultsPagination
                  currentPage={safePage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  labelSuffix="bottom"
                  className="mt-10 border-t border-surface-border pt-8"
                />
              ) : null}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

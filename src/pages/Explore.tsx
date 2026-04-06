import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, ArrowRight, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RestaurantCard from "@/components/RestaurantCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { getRestaurantsByCity } from "@/data/mockRestaurants";
import { cn } from "@/lib/utils";

type SortMode = "match" | "rating" | "az";

const sortOptions: { value: SortMode; label: string }[] = [
  { value: "match", label: "Best Match" },
  { value: "rating", label: "Highest Rated" },
  { value: "az", label: "A\u2013Z" },
];

export default function Explore() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const cityParam = params.get("city") || "";
  const [searchInput, setSearchInput] = useState(cityParam);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortMode>("match");

  useEffect(() => {
    setSearchInput(cityParam);
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [cityParam]);

  const results = useMemo(() => {
    const list = getRestaurantsByCity(cityParam);
    if (sort === "rating") return [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "az") return [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [cityParam, sort]);

  const handleSearch = () => {
    const v = searchInput.trim();
    if (v) navigate(`/explore?city=${encodeURIComponent(v)}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-14">
        {/* Search bar */}
        <div className="sticky top-14 z-40 bg-background/80 backdrop-blur-xl border-b border-surface-border">
          <div className="container py-3">
            <div className="relative max-w-lg">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search a city..."
                className="w-full h-10 rounded-full bg-surface border border-surface-border pl-10 pr-24 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-border-hover transition-colors"
              />
              <button
                onClick={handleSearch}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-4 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1 hover:opacity-90 transition-opacity"
              >
                Search <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>

        <div className="container py-8">
          {/* Header & filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {cityParam ? `Restaurants in ${cityParam}` : "All Restaurants"}
              </h1>
              {!loading && (
                <p className="text-sm text-muted-foreground mt-1">
                  {results.length} result{results.length !== 1 && "s"}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSort(opt.value)}
                  className={cn(
                    "text-xs px-3 py-1.5 rounded-full border transition-colors",
                    sort === opt.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-surface border-surface-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Search size={40} className="text-muted-foreground mb-4" />
              <h2 className="text-lg font-semibold text-foreground mb-1">
                No restaurants found in {cityParam || "this area"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Try another city like Manila, Tokyo, or New York.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

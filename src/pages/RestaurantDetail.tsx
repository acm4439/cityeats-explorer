import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Navigation, Clock, Phone, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RestaurantCard from "@/components/RestaurantCard";
import { RestaurantGridCell, RestaurantResultsGrid } from "@/components/RestaurantResultsGrid";
import RestaurantMap from "@/components/RestaurantMap";
import { fetchBusinessById, fetchBusinessReviews, fetchSimilarRestaurants } from "@/services/yelp";
import type { Restaurant, RestaurantReview } from "@/types/restaurant";
import { cn } from "@/lib/utils";

function ratingColor(rating: number) {
  if (rating >= 4) return "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80";
  if (rating >= 3) return "bg-amber-50 text-amber-900 ring-1 ring-amber-200/80";
  return "bg-stone-100 text-stone-600 ring-1 ring-stone-200/90";
}

const infoTileClass =
  "flex gap-4 rounded-xl border border-surface-border bg-card p-5 shadow-sm card-noise card-top-highlight lg:p-6";

export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [reviews, setReviews] = useState<RestaurantReview[]>([]);
  const [similar, setSimilar] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setRestaurant(null);
      setReviews([]);
      setSimilar([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let cancelled = false;

    Promise.all([fetchBusinessById(id), fetchBusinessReviews(id, 3)])
      .then(async ([r, revs]) => {
        if (cancelled) return;
        setRestaurant(r);
        setReviews(revs);
        const others = await fetchSimilarRestaurants(r.id, r.coordinates.lat, r.coordinates.lng, r.city);
        if (!cancelled) setSimilar(others);
      })
      .catch((e) => {
        if (cancelled) return;
        if (e instanceof Error && e.message === "NOT_FOUND") {
          setRestaurant(null);
          setReviews([]);
          setSimilar([]);
        } else {
          setError("Something went wrong. Please try again.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-14">
          <p className="text-muted-foreground">Loading…</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center pt-14 gap-3 px-4 text-center">
          <p className="text-destructive">{error}</p>
          <Link to="/explore" className="text-sm text-muted-foreground hover:text-foreground underline">
            Back to explore
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-14">
          <p className="text-muted-foreground">Restaurant not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const { name, cuisine, rating, address, coordinates, phone, hours, price, shortDescription, city, reviewCount, imageUrl, yelpUrl, isClosed } =
    restaurant;
  const lat = coordinates.lat;
  const lng = coordinates.lng;
  const hasCoords = lat != null && lng != null;
  const coordStr = hasCoords
    ? `${Math.abs(lat).toFixed(4)}\u00B0 ${lat >= 0 ? "N" : "S"}, ${Math.abs(lng).toFixed(4)}\u00B0 ${lng >= 0 ? "E" : "W"}`
    : "Coordinates unavailable";

  const exploreCity = encodeURIComponent(city);
  const mapsHref =
    hasCoords ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}` : null;

  const infoItems = [
    { icon: MapPin, label: "Address", value: address },
    { icon: Navigation, label: "Coordinates", value: coordStr, mono: true },
    { icon: Clock, label: "Hours", value: hours, preline: true },
    { icon: Phone, label: "Phone", value: phone },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col animate-page-enter">
      <Navbar />
      <main className="flex-1 pt-14">
        <div className="mx-auto w-full max-w-[1480px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12 xl:px-12 xl:py-16 2xl:px-16">
          <Link
            to={`/explore?city=${exploreCity}`}
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground lg:mb-10 xl:mb-12"
          >
            <ArrowLeft size={16} />
            Back to results
          </Link>

          <div className="grid grid-cols-1 gap-10 lg:gap-12 xl:grid-cols-[minmax(0,1fr),min(20rem,100%)] xl:gap-x-14 xl:gap-y-12 2xl:grid-cols-[minmax(0,1fr),26rem] 2xl:gap-x-16">
            {/* Primary column — hero, title, actions, long-form content */}
            <div className="min-w-0 space-y-10 lg:space-y-12 xl:col-start-1 xl:row-start-1 xl:max-w-4xl 2xl:max-w-5xl">
              {imageUrl ? (
                <div className="overflow-hidden rounded-2xl border border-surface-border bg-card shadow-sm">
                  <img
                    src={imageUrl}
                    alt={name}
                    className="aspect-[20/9] max-h-[min(52vw,520px)] w-full object-cover md:aspect-[2.6/1] lg:max-h-[480px] 2xl:max-h-[540px]"
                  />
                </div>
              ) : null}

              <header className="space-y-6 lg:space-y-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-4xl xl:text-5xl xl:leading-tight 2xl:text-[3.25rem]">
                  {name}
                </h1>

                <div className="flex flex-wrap items-center gap-2 gap-y-3 lg:gap-3">
                  <span className="rounded-full border border-surface-border bg-secondary px-3 py-1.5 text-xs font-mono text-primary lg:px-4 lg:py-2 lg:text-sm">
                    {cuisine}
                  </span>
                  <span className="rounded-full border border-surface-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground lg:px-4 lg:py-2 lg:text-sm">
                    {price}
                  </span>
                  {isClosed ? (
                    <span className="rounded-full border border-destructive/30 bg-destructive/15 px-3 py-1.5 text-xs text-destructive lg:px-4 lg:py-2 lg:text-sm">
                      Permanently closed
                    </span>
                  ) : null}
                  {rating != null ? (
                    <span className={cn("rounded-full px-3 py-1.5 text-sm font-semibold lg:px-4 lg:py-2 lg:text-base", ratingColor(rating))}>
                      ★ {rating.toFixed(1)}
                    </span>
                  ) : (
                    <span className="rounded-full bg-muted px-3 py-1.5 text-sm font-semibold text-muted-foreground lg:px-4 lg:py-2">
                      No rating
                    </span>
                  )}
                  {reviewCount != null && reviewCount > 0 ? (
                    <span className="w-full text-sm text-muted-foreground sm:w-auto lg:text-base">Based on {reviewCount.toLocaleString()} Yelp reviews</span>
                  ) : (
                    <span className="w-full text-sm text-muted-foreground sm:w-auto lg:text-base">Ratings from Yelp</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 lg:gap-4">
                  {yelpUrl ? (
                    <a
                      href={yelpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-card px-5 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted/80 lg:px-6 lg:py-3 lg:text-base"
                    >
                      View on Yelp
                      <ExternalLink size={16} className="opacity-70" />
                    </a>
                  ) : null}
                  {mapsHref ? (
                    <a
                      href={mapsHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-card px-5 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted/80 lg:px-6 lg:py-3 lg:text-base"
                    >
                      Open in Google Maps
                      <ExternalLink size={16} className="opacity-70" />
                    </a>
                  ) : null}
                </div>
              </header>
            </div>

            {/* Quick facts + map — scrolls with the page (same scroll as left column) */}
            <aside className="space-y-8 xl:col-start-2 xl:row-start-1 xl:row-span-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1 xl:gap-5">
                {infoItems.map((item) => (
                  <div key={item.label} className={infoTileClass}>
                    <item.icon size={20} className="mt-0.5 shrink-0 text-primary lg:size-[22px]" />
                    <div className="min-w-0">
                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{item.label}</p>
                      <p
                        className={cn(
                          "text-sm leading-relaxed text-foreground lg:text-base",
                          item.mono && "font-mono text-[0.9375rem]",
                          item.preline && "whitespace-pre-line",
                        )}
                      >
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <section>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-1 w-10 rounded-full bg-accent/70" />
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Location</h2>
                </div>
                {hasCoords ? (
                  <RestaurantMap lat={lat} lng={lng} label={name} />
                ) : (
                  <div className="rounded-xl border border-dashed border-surface-border bg-muted/20 p-12 text-center">
                    <MapPin size={32} className="mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Map unavailable — no coordinates for this place.</p>
                  </div>
                )}
                <p className="mt-3 text-center text-[11px] text-muted-foreground lg:text-xs">
                  Map data ©{" "}
                  <a href="https://www.openstreetmap.org/copyright" className="underline hover:text-foreground">
                    OpenStreetMap
                  </a>{" "}
                  contributors
                </p>
              </section>
            </aside>

            {/* Continuation of primary column */}
            <div className="min-w-0 space-y-12 lg:space-y-14 xl:col-start-1 xl:row-start-2">
              <section>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-1 w-10 rounded-full bg-accent/70" />
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Categories</h2>
                </div>
                <p className="max-w-3xl text-base leading-relaxed text-foreground lg:text-lg lg:leading-relaxed xl:max-w-4xl 2xl:text-xl 2xl:leading-relaxed">
                  {shortDescription}
                </p>
              </section>

              {reviews.length > 0 ? (
                <section>
                  <div className="mb-5 flex items-center gap-3">
                    <div className="h-1 w-10 rounded-full bg-accent/70" />
                    <h2 className="text-lg font-semibold text-foreground lg:text-xl">Recent Yelp reviews</h2>
                  </div>
                  <ul className="grid gap-5 lg:max-w-4xl lg:gap-6">
                    {reviews.map((rev) => (
                      <li key={rev.id} className="rounded-xl border border-surface-border bg-card p-5 shadow-sm lg:p-6 card-noise">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", ratingColor(rev.rating))}>★ {rev.rating}</span>
                          <span className="text-sm font-medium text-foreground lg:text-base">{rev.author}</span>
                          {rev.timeCreated ? <span className="text-xs text-muted-foreground lg:text-sm">{rev.timeCreated}</span> : null}
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-6 lg:text-base lg:leading-relaxed">{rev.text}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <section className="pb-4">
                <div className="mb-6 flex items-center gap-3">
                  <div className="h-1 w-10 rounded-full bg-accent/70" />
                  <h2 className="text-lg font-semibold text-foreground lg:text-xl">You might also like</h2>
                </div>
                <RestaurantResultsGrid>
                  {similar.map((r) => (
                    <RestaurantGridCell key={r.id}>
                      <RestaurantCard restaurant={r} />
                    </RestaurantGridCell>
                  ))}
                </RestaurantResultsGrid>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

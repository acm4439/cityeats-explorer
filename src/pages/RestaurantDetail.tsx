import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Navigation, Clock, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RestaurantCard from "@/components/RestaurantCard";
import { getRestaurantById, getSimilarRestaurants } from "@/data/mockRestaurants";
import { cn } from "@/lib/utils";

function ratingColor(rating: number) {
  if (rating >= 4) return "bg-success/15 text-success";
  if (rating >= 3) return "bg-warning/15 text-warning";
  return "bg-muted text-muted-foreground";
}

export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const restaurant = getRestaurantById(id || "");
  const similar = getSimilarRestaurants(id || "");

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

  const { name, cuisine, rating, address, coordinates, phone, hours, price, shortDescription } = restaurant;
  const coordStr = `${Math.abs(coordinates.lat).toFixed(4)}\u00B0 ${coordinates.lat >= 0 ? "N" : "S"}, ${Math.abs(coordinates.lng).toFixed(4)}\u00B0 ${coordinates.lng >= 0 ? "E" : "W"}`;

  return (
    <div className="min-h-screen flex flex-col animate-page-enter">
      <Navbar />
      <main className="flex-1 pt-14">
        <div className="container max-w-3xl py-8">
          {/* Back */}
          <Link to="/explore" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft size={16} />
            Back to results
          </Link>

          {/* Header */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-4">{name}</h1>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-secondary text-primary border border-surface-border">
              {cuisine}
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground border border-surface-border">
              {price}
            </span>
            <span className={cn("text-sm font-semibold px-3 py-1 rounded-full", ratingColor(rating))}>
              ★ {rating.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">Based on reviews</span>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {[
              { icon: MapPin, label: "Address", value: address },
              { icon: Navigation, label: "Coordinates", value: coordStr, mono: true },
              { icon: Clock, label: "Hours", value: hours },
              { icon: Phone, label: "Phone", value: phone },
            ].map((item) => (
              <div key={item.label} className="flex gap-3 p-5 rounded-lg bg-surface border border-surface-border card-noise card-top-highlight">
                <item.icon size={18} className="text-primary/60 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                  <p className={cn("text-sm text-foreground", item.mono && "font-mono")}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* About */}
          <section className="mb-10">
            <div className="w-10 h-[3px] rounded-full bg-accent/60 mb-3" />
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-3">About</h2>
            <p className="text-foreground leading-relaxed">{shortDescription}</p>
          </section>

          {/* Map placeholder */}
          <section className="mb-12">
            <div className="rounded-lg border border-dashed border-surface-border bg-surface p-10 flex flex-col items-center justify-center text-center card-noise">
              <MapPin size={28} className="text-muted-foreground mb-3" />
              <p className="font-mono text-sm text-muted-foreground mb-1">{coordStr}</p>
              <p className="text-xs text-muted-foreground">Interactive map coming soon</p>
            </div>
          </section>

          {/* Similar */}
          <section>
            <div className="w-10 h-[3px] rounded-full bg-accent/60 mb-3" />
            <h2 className="text-lg font-semibold text-foreground mb-4">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 overflow-x-auto">
              {similar.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

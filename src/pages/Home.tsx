import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ListFilter, MapPin, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const popularCities = ["Manila", "New York", "Tokyo", "Paris", "London", "Sydney"];

const steps = [
  { icon: Search, num: "01", title: "Enter a city", desc: "Type any city name worldwide" },
  { icon: ListFilter, num: "02", title: "Browse results", desc: "Instantly see top restaurants" },
  { icon: MapPin, num: "03", title: "Explore details", desc: "Ratings, address, coordinates" },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (city?: string) => {
    const value = city || query.trim();
    if (value) navigate(`/explore?city=${encodeURIComponent(value)}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative flex items-center justify-center min-h-screen pt-14 glow-bg">
        <div className="container max-w-2xl text-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-4">
            Find your next
            <br />
            <span className="text-gradient">great meal.</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl mb-8 leading-relaxed">
            Search any city. Discover restaurants worth going to.
          </p>

          {/* Search bar */}
          <div className="relative max-w-[560px] mx-auto mb-10">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Try Manila, Tokyo, New York..."
              className="w-full h-12 md:h-14 rounded-full bg-surface border border-surface-border px-5 pr-28 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-border-hover transition-colors"
            />
            <button
              onClick={() => handleSearch()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 md:h-11 px-5 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            >
              Search
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Popular cities */}
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Popular right now</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularCities.map((city) => (
                <button
                  key={city}
                  onClick={() => handleSearch(city)}
                  className="text-sm px-4 py-1.5 rounded-full border border-surface-border bg-surface text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 border-t border-surface-border">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="text-center md:text-left">
                <span className="font-mono text-xs text-primary/50 mb-2 block">{step.num}</span>
                <step.icon size={24} className="text-primary mx-auto md:mx-0 mb-3" />
                <h3 className="text-base font-semibold text-foreground mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

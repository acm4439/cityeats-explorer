import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col animate-page-enter">
      <Navbar />
      <main className="flex-1 pt-14">
        <div className="container max-w-[680px] py-16">
          <div className="w-10 h-[3px] rounded-full bg-accent/60 mb-6" />
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-6">
            About CityEats Explorer
          </h1>
          <p className="text-foreground leading-relaxed mb-10">
            CityEats Explorer is a city-based restaurant discovery platform. Enter any city and instantly browse a curated list of restaurants with ratings, addresses, cuisine types, and coordinates — all in one clean interface.
          </p>

          {/* How it works */}
          <div className="w-10 h-[3px] rounded-full bg-accent/60 mb-4" />
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-6">How It Works</h2>
          <div className="space-y-6 mb-12">
            {[
              { num: "01", title: "Enter a city", desc: "Type any city name into the search bar — from Manila to Manhattan, we'll find what's there." },
              { num: "02", title: "Browse results", desc: "Instantly see a curated grid of restaurants with key details: cuisine, rating, and location." },
              { num: "03", title: "Explore details", desc: "Tap into any restaurant for the full picture — ratings, address, coordinates, hours, and more." },
            ].map((step) => (
              <div key={step.num} className="flex gap-4">
                <span className="font-mono text-sm text-primary/50 pt-0.5">{step.num}</span>
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Data callout */}
          <div className="rounded-lg border border-surface-border bg-surface-hover p-5 border-l-4 border-l-accent">
            <h3 className="text-sm font-semibold text-foreground mb-2">Data &amp; Accuracy</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Restaurant data is sourced from the Yelp Fusion API and reflects listings near your searched city (about a five-mile radius when coordinates are available).
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

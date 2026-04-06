import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const techStack = ["React", "Tailwind CSS", "Foursquare Places API", "React Router"];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-14">
        <div className="container max-w-[680px] py-16">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-6">
            About CityEats Explorer
          </h1>
          <p className="text-foreground leading-relaxed mb-10">
            CityEats Explorer is a city-based restaurant discovery platform. Enter any city and instantly browse a curated list of restaurants with ratings, addresses, cuisine types, and coordinates — all in one clean interface.
          </p>

          {/* How it works */}
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

          {/* Built with */}
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Built With</h2>
          <div className="flex flex-wrap gap-2 mb-12">
            {techStack.map((tech) => (
              <span key={tech} className="text-xs px-3 py-1.5 rounded-full bg-surface border border-surface-border text-muted-foreground font-mono">
                {tech}
              </span>
            ))}
          </div>

          {/* Data callout */}
          <div className="rounded-lg border border-surface-border bg-surface p-5">
            <h3 className="text-sm font-semibold text-foreground mb-2">Data &amp; Accuracy</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Restaurant data is sourced from the Foursquare Places API and reflects real-time availability within your searched city.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

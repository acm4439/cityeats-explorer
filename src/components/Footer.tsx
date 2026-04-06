import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-background">
      <div className="container py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded bg-primary" />
            <span className="font-bold text-foreground">CityEats</span>
            <span className="font-bold text-gradient-amber">Explorer</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Discover restaurants worth going to, in any city.
          </p>
        </div>
        <div className="flex items-center justify-start md:justify-center gap-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/explore" className="text-muted-foreground hover:text-foreground transition-colors">Explore</Link>
          <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
        </div>
        <div className="flex flex-col items-start md:items-end justify-center">
          <p className="text-muted-foreground text-xs">Powered by Foursquare</p>
        </div>
      </div>
      <div className="border-t border-surface-border">
        <div className="container py-4">
          <p className="text-xs text-muted-foreground text-center">
            &copy; 2025 CityEats Explorer
          </p>
        </div>
      </div>
    </footer>
  );
}

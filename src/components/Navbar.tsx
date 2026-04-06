import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Explore", to: "/explore" },
  { label: "About", to: "/about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-14 border-b border-surface-border transition-all duration-300",
        scrolled ? "bg-background/92 backdrop-blur-md shadow-sm" : "bg-background",
      )}
    >
      <div className="container h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <BrandMark className="size-6" />
          <span className="text-base font-bold tracking-tight text-foreground">
            CityEats
          </span>
          <span className="text-base font-bold tracking-tight text-gradient-amber">
            Explorer
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "text-sm transition-colors relative py-1 flex flex-col items-center gap-1",
                location.pathname === link.to
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
              <span
                className={cn(
                  "w-1 h-1 rounded-full bg-accent transition-opacity duration-200",
                  location.pathname === link.to ? "opacity-100" : "opacity-0"
                )}
              />
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-surface-border">
          <div className="container py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "text-sm py-2 transition-colors flex items-center gap-2",
                  location.pathname === link.to
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {location.pathname === link.to && (
                  <span className="w-1 h-1 rounded-full bg-accent" />
                )}
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

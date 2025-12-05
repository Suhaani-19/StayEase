import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Search, Menu, User, Heart, Home } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [location, setLocationWouter] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;
    setLocationWouter(`/search?keyword=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-3 py-2 -ml-3">
              <Home className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">StayEase</span>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search
                onClick={handleSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer"
              />
              <input
                type="search"
                placeholder="Search destinations..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full h-9 pl-9 pr-4 rounded-full border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                data-testid="input-search"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" className={location === "/dashboard" ? "bg-accent" : ""}>
                Dashboard
              </Button>
            </Link>
            <Link href="/bookings">
              <Button variant="ghost" className={location === "/bookings" ? "bg-accent" : ""}>
                My Bookings
              </Button>
            </Link>
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Link href="/login">
              <Button variant="default">
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <Search
                onClick={handleSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer"
              />
              <input
                type="search"
                placeholder="Search destinations..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full h-9 pl-9 pr-4 rounded-full border bg-background"
                data-testid="input-search-mobile"
              />
            </div>

            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start">
                Dashboard
              </Button>
            </Link>
            <Link href="/bookings">
              <Button variant="ghost" className="w-full justify-start">
                My Bookings
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="default" className="w-full">
                Login / Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

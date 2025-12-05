import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ListingCard from "@/components/ListingCard";
import { Button } from "@/components/ui/button";

const API_URL =
  import.meta.env.VITE_API_URL || "https://stayease-1-mijo.onrender.com";

type Listing = {
  _id: string;
  title: string;
  location: string;
  price: number;
  rating?: number;
  reviewCount?: number;
  images?: string[];
  type?: string;
};

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const [, setLocation] = useLocation();

  // --- Filter state ---
  const [keyword, setKeyword] = useState("");
  const [locationValue, setLocationValue] = useState("");
  const [type, setType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${API_URL}/api/listings/all`);
        if (!res.ok) throw new Error("Failed to fetch listings");

        const data = await res.json();
        setListings(data);
      } catch (err) {
        console.error("Error fetching listings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // --- Handle search/apply filters ---
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (locationValue) params.set("location", locationValue);
    if (type) params.set("type", type);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    // Redirect to /search page with query params
    setLocation(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section + Search Filters */}
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            className="border p-2 rounded col-span-1 md:col-span-2"
            placeholder="Keyword..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <input
            className="border p-2 rounded col-span-1"
            placeholder="Location..."
            value={locationValue}
            onChange={(e) => setLocationValue(e.target.value)}
          />
          <select
            className="border p-2 rounded col-span-1"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Any Type</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="hotel">Hotel</option>
          </select>
          <Button onClick={handleSearch} className="col-span-1">
            Search
          </Button>
        </div>
      </div>

      {/* Popular Destinations */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Popular destinations</h2>
            <p className="text-muted-foreground">
              Discover our most loved accommodations
            </p>
          </div>
          <Button variant="outline">View All</Button>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading listings...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={listing._id}
                _id={listing._id}
                title={listing.title}
                location={listing.location}
                price={listing.price}
                rating={listing.rating}
                reviewCount={listing.reviewCount}
                images={listing.images}
                type={listing.type}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

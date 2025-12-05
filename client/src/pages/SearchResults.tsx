import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import ListingCard from "@/components/ListingCard";
import SearchFilters from "@/components/SearchFilters";

// Define a type that matches ListingCard props
interface Listing {
  _id: string;
  title: string;
  location: string;
  price: number;
  rating?: number;
  reviewCount?: number;
  images?: string[];
  type?: string;
}

export default function SearchResults() {
  const [searchParams] = useLocation();
  const query = new URLSearchParams(window.location.search);

  const [results, setResults] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/listings/search?` + query.toString()
      );

      if (!res.ok) {
        throw new Error("Failed to fetch listings");
      }

      const data = await res.json();

      // Map API results to Listing type for ListingCard
      const listings: Listing[] = (data.listings || []).map((l: any) => ({
        _id: l._id,
        title: l.title,
        location: l.location,
        price: l.price,
        rating: l.rating,
        reviewCount: l.reviewCount,
        images: l.images,
        type: l.type,
      }));

      setResults(listings);
    } catch (error) {
      console.error("Error fetching listings:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [window.location.search]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Search Results</h1>

      <SearchFilters />

      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p>No listings found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {results.map((listing) => (
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
    </div>
  );
}

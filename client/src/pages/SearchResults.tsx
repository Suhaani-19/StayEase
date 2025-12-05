//client/src/pages/SearchResults.tsx
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import ListingCard from "@/components/ListingCard";
import SearchFilters from "@/components/SearchFilters";

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
  const [searchParams, setSearchParams] = useLocation() as [
    string,
    (path: string, replace?: boolean) => void
  ];

  const [results, setResults] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(searchParams.split("?")[1] || "");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/listings/search?${query.toString()}`
      );

      if (!res.ok) throw new Error("Failed to fetch listings");

      const data = await res.json();
      const listings: Listing[] = Array.isArray(data) ? data : data.listings || [];
      setResults(listings);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [searchParams]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Search Results</h1>

      <SearchFilters setSearchParams={setSearchParams} />

      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p>No listings found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {results.map((listing) => (
            <ListingCard key={listing._id} {...listing} />
          ))}
        </div>
      )}
    </div>
  );
}

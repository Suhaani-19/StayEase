import { useEffect, useState } from "react";
import ListingCard from "@/components/ListingCard";
import SearchFilters from "@/components/SearchFilters";

interface Listing {
  _id: string;
  title: string;
  location: string;
  price: number;
  type?: string;
  images?: string[];
  ownerName?: string;
}

export default function SearchResults() {
  const [results, setResults] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch results based on current URL query
  const fetchResults = async () => {
    setLoading(true);
    try {
      const query = window.location.search; // get ?location=...&type=...
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listings/search${query}`);
      if (!res.ok) throw new Error("Failed to fetch listings");
      const data = await res.json();
      setResults(data.listings || []);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();

    // Re-fetch when URL changes (user clicks Apply Filters)
    const onPopState = () => fetchResults();
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

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
            <ListingCard key={listing._id} {...listing} />
          ))}
        </div>
      )}
    </div>
  );
}

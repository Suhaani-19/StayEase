import { useState } from "react";

export default function SearchFilters() {
  const query = new URLSearchParams(window.location.search);

  const [locationValue, setLocationValue] = useState(query.get("location") || "");
  const [type, setType] = useState(query.get("type") || "");
  const [minPrice, setMinPrice] = useState(query.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(query.get("maxPrice") || "");
  const [sort, setSort] = useState(query.get("sort") || "newest");

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (locationValue) params.set("location", locationValue);
    if (type) params.set("type", type);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sort) params.set("sort", sort);

    // Update browser URL and trigger re-fetch
    window.history.pushState({}, "", `/search?${params.toString()}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-100 p-4 rounded-lg">
      <input
        className="border p-2 rounded"
        placeholder="Location"
        value={locationValue}
        onChange={(e) => setLocationValue(e.target.value)}
      />
      <select
        className="border p-2 rounded"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="">Any Type</option>
        <option value="apartment">Apartment</option>
        <option value="house">House</option>
        <option value="villa">Villa</option>
        <option value="hotel">Hotel</option>
      </select>
      <input
        className="border p-2 rounded"
        type="number"
        placeholder="Min Price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />
      <input
        className="border p-2 rounded"
        type="number"
        placeholder="Max Price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />
      <select
        className="border p-2 rounded"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="price_low_high">Price: Low → High</option>
        <option value="price_high_low">Price: High → Low</option>
      </select>
      <button
        onClick={applyFilters}
        className="bg-black text-white p-2 rounded hover:bg-gray-900 col-span-full md:col-auto"
      >
        Apply Filters
      </button>
    </div>
  );
}

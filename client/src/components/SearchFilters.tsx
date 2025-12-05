//client/src/components/SearchFilters.tsx
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function SearchFilters() {
  const [, setLocation] = useLocation();
  const query = new URLSearchParams(window.location.search);

  const [keyword, setKeyword] = useState(query.get("keyword") || "");
  const [locationValue, setLocationValue] = useState(query.get("location") || "");
  const [type, setType] = useState(query.get("type") || "");
  const [minPrice, setMinPrice] = useState(query.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(query.get("maxPrice") || "");
  const [startDate, setStartDate] = useState(query.get("startDate") || "");
  const [endDate, setEndDate] = useState(query.get("endDate") || "");
  const [rating, setRating] = useState(query.get("rating") || "");
  const [sort, setSort] = useState(query.get("sort") || "newest");

  const updateURL = () => {
    const params = new URLSearchParams();

    if (keyword) params.set("keyword", keyword);
    if (locationValue) params.set("location", locationValue);
    if (type) params.set("type", type);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (rating) params.set("rating", rating);
    if (sort) params.set("sort", sort);

    setLocation(`/search?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 gap-4 bg-gray-100 p-4 rounded-lg">
      {/* Keyword */}
      <input
        className="border p-2 rounded"
        placeholder="Search keyword..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      {/* Location */}
      <input
        className="border p-2 rounded"
        placeholder="Location..."
        value={locationValue}
        onChange={(e) => setLocationValue(e.target.value)}
      />

      {/* Type */}
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

      {/* Price */}
      <div className="grid grid-cols-2 gap-2">
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
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-2">
        <input
          className="border p-2 rounded"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* Rating */}
      <select
        className="border p-2 rounded"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      >
        <option value="">Any Rating</option>
        <option value="3">3★+</option>
        <option value="4">4★+</option>
        <option value="4.5">4.5★+</option>
      </select>

      {/* Sort */}
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
        onClick={updateURL}
        className="bg-black text-white p-2 rounded hover:bg-gray-900"
      >
        Apply Filters
      </button>
    </div>
  );
}

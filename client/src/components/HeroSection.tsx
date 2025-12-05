import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import heroImage from "@assets/generated_images/Luxury_apartment_hero_image_61b5d705.png";

export default function HeroSection() {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");

  const [, navigate] = useLocation();

  const handleSearch = () => {
    const params = new URLSearchParams();

    // Only add params if values exist
    if (location) params.set("location", location);
    if (checkIn) params.set("startDate", checkIn);
    if (checkOut) params.set("endDate", checkOut);
    if (guests) params.set("guests", guests);

    // Navigate to the Search page with query parameters
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section
      className="relative h-[90vh] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${heroImage})`,
      }}
    >
      <div className="text-center text-white px-4 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          Find Your Next Stay
        </h1>
        <p className="text-lg md:text-2xl mb-8 drop-shadow-md">
          Discover the best apartments, villas, and rooms worldwide.
        </p>

        <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
          
          {/* Location */}
          <div className="flex items-center gap-2 border p-2 rounded-lg bg-white flex-1">
            <MapPin className="h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Where to?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent outline-none w-full text-gray-800"
            />
          </div>

          {/* Check-in */}
          <div className="flex items-center gap-2 border p-2 rounded-lg bg-white">
            <Calendar className="h-5 w-5 text-gray-500" />
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="bg-transparent outline-none text-gray-800"
            />
          </div>

          {/* Check-out */}
          <div className="flex items-center gap-2 border p-2 rounded-lg bg-white">
            <Calendar className="h-5 w-5 text-gray-500" />
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="bg-transparent outline-none text-gray-800"
            />
          </div>

          {/* Guests */}
          <div className="flex items-center gap-2 border p-2 rounded-lg bg-white">
            <Users className="h-5 w-5 text-gray-500" />
            <input
              type="number"
              min="1"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="bg-transparent outline-none w-16 text-gray-800"
            />
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className="w-full md:w-auto flex items-center gap-2 px-6"
          >
            <Search className="h-5 w-5" />
            Search
          </Button>
        </div>
      </div>
    </section>
  );
}

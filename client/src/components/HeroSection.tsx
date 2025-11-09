import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { useState } from "react";
import heroImage from "@assets/generated_images/Luxury_apartment_hero_image_61b5d705.png";

export default function HeroSection() {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");

  const handleSearch = () => {
    console.log("Search triggered:", { location, checkIn, checkOut, guests });
  };

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
      </div>

      <div className="relative h-full flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Find your perfect stay
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Discover amazing places to stay around the world
          </p>

          <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Where are you going?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-11 pl-9 pr-4 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  data-testid="input-location"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full h-11 pl-9 pr-4 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  data-testid="input-checkin"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full h-11 pl-9 pr-4 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  data-testid="input-checkout"
                />
              </div>

              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full h-11 pl-9 pr-4 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                  data-testid="select-guests"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5+ Guests</option>
                </select>
              </div>
            </div>

            <Button
              onClick={handleSearch}
              className="w-full mt-4"
              size="lg"
              data-testid="button-search"
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

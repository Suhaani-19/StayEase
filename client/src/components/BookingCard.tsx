// client/src/components/BookingCard.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users } from "lucide-react"; // ✅ ADDED Users
import { useState } from "react";
import { Label } from "@/components/ui/label";

const API_URL = import.meta.env.VITE_API_URL || "https://stayease-1-mijo.onrender.com";

interface BookingCardProps {
  listingId: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  image?: string;
  title?: string;
}
export default function BookingCard({ 
  listingId, 
  pricePerNight, 
  rating, 
  reviewCount, 
  image, 
  title 
}: BookingCardProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [loading, setLoading] = useState(false);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const nights = calculateNights();
  const subtotal = nights * pricePerNight;
  const serviceFee = subtotal * 0.1;
  const total = subtotal + serviceFee;

  const handleReserve = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    
    if (!token || !userId) {
      alert("Please login first");
      return;
    }

    if (!checkIn || !checkOut || nights === 0) {
      alert("Please select valid check-in and check-out dates");
      return;
    }

    setLoading(true);
    
    try {
      const bookingData = {
        listingId,
        guestId: userId,
        dates: {
          from: new Date(checkIn).toISOString(),
          to: new Date(checkOut).toISOString()
        },
        totalPrice: total,
        guests: Number(guests),
        status: "pending"
      };

      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (res.ok) {
        alert("✅ Booking created successfully!");
        // Reset form
        setCheckIn("");
        setCheckOut("");
        setGuests("1");
      } else {
        const error = await res.json();
        alert(`❌ Booking failed: ${error.message || "Unknown error"}`);
      }
    } catch (err: any) {
      console.error("Booking error:", err);
      alert(`❌ Booking error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 sticky top-24">
      {/* Price & Rating */}
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <span className="text-2xl font-semibold" data-testid="text-price">${pricePerNight}</span>
          <span className="text-muted-foreground"> / night</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium" data-testid="text-rating">{rating}</span>
          <span className="text-sm text-muted-foreground">({reviewCount} reviews)</span>
        </div>
      </div>

      {/* Dates & Guests */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs font-medium mb-1 block">Check-in</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full h-11 pl-9 pr-3 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                data-testid="input-checkin"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs font-medium mb-1 block">Check-out</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full h-11 pl-9 pr-3 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                data-testid="input-checkout"
              />
            </div>
          </div>
        </div>

        <div>
          <Label className="text-xs font-medium mb-1 block">Guests</Label>
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
      </div>

      {/* Reserve Button */}
      <Button 
        onClick={handleReserve} 
        className="w-full mb-4" 
        size="lg" 
        disabled={loading}
        data-testid="button-reserve"
      >
        {loading ? "Creating Booking..." : "Reserve"}
      </Button>

      {/* Price Breakdown */}
      {nights > 0 && (
        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              ${pricePerNight} × {nights} nights
            </span>
            <span data-testid="text-subtotal">${subtotal.toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Service fee</span>
            <span data-testid="text-service-fee">${serviceFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold pt-2 border-t">
            <span>Total</span>
            <span data-testid="text-total">${total.toFixed(2)}</span>
          </div>
        </div>
      )}
    </Card>
  );
}

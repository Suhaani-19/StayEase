// client/src/pages/BookingDetail.tsx
import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

const API_URL = import.meta.env.VITE_API_URL || "https://stayease-1-mijo.onrender.com";

interface Booking {
  _id: string;
  listingId: string;
  guestId: { name: string };
  dates: { from: string; to: string };
  totalPrice: number;
  status: string;
}

interface Listing {
  _id: string;
  title: string;
  location: string;
  images: string[];
  price: number;
}

export default function BookingDetail() {
  const [, params] = useRoute("/booking/:id");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      fetchBooking(params.id);
    }
  }, [params?.id]);

  const fetchBooking = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      
      // Fetch booking
      const bookingRes = await fetch(`${API_URL}/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const bookingData = await bookingRes.json();
      setBooking(bookingData);

      // Fetch listing details
      if (bookingData.listingId) {
        const listingRes = await fetch(`${API_URL}/api/listings/${bookingData.listingId}`);
        const listingData = await listingRes.json();
        setListing(listingData);
      }
    } catch (err) {
      console.error("Failed to fetch booking");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading booking...</div>;
  if (!booking) return <div className="min-h-screen bg-background flex items-center justify-center">Booking not found</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Booking Details</h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Listing Info */}
          <div className="bg-white p-8 rounded-lg shadow">
            <img 
              src={listing?.images?.[0] || ""} 
              alt={listing?.title} 
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            <h2 className="text-2xl font-bold mb-4">{listing?.title}</h2>
            <p className="text-xl text-gray-600 mb-6">{listing?.location}</p>
            <p className="text-3xl font-bold">${booking.totalPrice}</p>
          </div>

          {/* Booking Info */}
          <div className="bg-white p-8 rounded-lg shadow">
            <div className="space-y-4 mb-6">
              <div>
                <span className="font-semibold">Guest:</span> {booking.guestId?.name}
              </div>
              <div>
                <span className="font-semibold">Check-in:</span> {new Date(booking.dates.from).toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold">Check-out:</span> {new Date(booking.dates.to).toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold">Status:</span>
                <span className={`ml-2 px-4 py-2 rounded-full text-sm font-semibold ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status.toUpperCase()}
                </span>
              </div>
            </div>
            <Button asChild className="w-full">
              <a href={`/booking-edit/${booking._id}`}>Edit Booking</a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

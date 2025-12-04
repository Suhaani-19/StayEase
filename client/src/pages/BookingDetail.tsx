// client/src/pages/BookingDetail.tsx
import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

const API_URL =
  import.meta.env.VITE_API_URL || "https://stayease-1-mijo.onrender.com";

interface Booking {
  _id: string;
  listingId:
    | string
    | {
        _id: string;
        title?: string;
        location?: string;
        images?: string[];
        price?: number;
      };
  guestId: { name: string } | string;
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

      // Fetch booking (listingId is populated in backend)
      const bookingRes = await fetch(`${API_URL}/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const bookingData: Booking = await bookingRes.json();
      setBooking(bookingData);

      // If listing is populated, use it directly; otherwise fetch by id
      if (bookingData.listingId) {
        if (typeof bookingData.listingId === "object") {
          const populated = bookingData.listingId;
          setListing({
            _id: populated._id,
            title: populated.title || "",
            location: populated.location || "",
            images: populated.images || [],
            price: populated.price || bookingData.totalPrice,
          });
        } else {
          const listingRes = await fetch(
            `${API_URL}/api/listings/${bookingData.listingId}`
          );
          const listingData = await listingRes.json();
          setListing(listingData);
        }
      }
    } catch (err) {
      console.error("Failed to fetch booking", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!booking) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/bookings/${booking._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "confirmed" }),
      });
      if (!res.ok) {
        alert("❌ Payment / update failed");
        return;
      }
      const updated = await res.json();
      setBooking(updated);
      alert("✅ Payment successful, booking confirmed!");
    } catch {
      alert("❌ Network error during payment");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading booking...
      </div>
    );
  if (!booking)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Booking not found
      </div>
    );

  const guestName =
    typeof booking.guestId === "string"
      ? "Guest"
      : booking.guestId?.name || "Guest";

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
              alt={listing?.title || "Listing image"}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            <h2 className="text-2xl font-bold mb-4">
              {listing?.title || "Listing"}
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              {listing?.location || ""}
            </p>
            <p className="text-3xl font-bold">${booking.totalPrice}</p>
          </div>

          {/* Booking Info */}
          <div className="bg-white p-8 rounded-lg shadow">
            <div className="space-y-4 mb-6">
              <div>
                <span className="font-semibold">Guest:</span> {guestName}
              </div>
              <div>
                <span className="font-semibold">Check-in:</span>{" "}
                {new Date(booking.dates.from).toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold">Check-out:</span>{" "}
                {new Date(booking.dates.to).toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold">Status:</span>
                <span
                  className={`ml-2 px-4 py-2 rounded-full text-sm font-semibold ${
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {booking.status.toUpperCase()}
                </span>
              </div>
            </div>

            {booking.status === "pending" && (
              <Button
                className="w-full mb-3"
                onClick={handleConfirmPayment}
              >
                Pay & Confirm Booking
              </Button>
            )}

            <Button asChild className="w-full" variant="outline">
              <a href={`/booking-edit/${booking._id}`}>Edit Booking</a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

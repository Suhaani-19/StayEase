import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_URL =
  import.meta.env.VITE_API_URL || "https://stayease-1-mijo.onrender.com";

export default function BookingEdit() {
  const [, params] = useRoute("/booking-edit/:id");
  const bookingId = params?.id;

  const [booking, setBooking] = useState<any>(null);
  const [listing, setListing] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchData(bookingId);
    }
  }, [bookingId]);

  const fetchData = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      // Fetch booking
      const bookingRes = await fetch(`${API_URL}/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!bookingRes.ok) throw new Error("Failed to load booking");
      const bookingData = await bookingRes.json();
      setBooking(bookingData);
      setStatus(bookingData.status);

      // Fetch listing (handle populated or plain id)
      if (bookingData.listingId) {
        const listingId =
          typeof bookingData.listingId === "string"
            ? bookingData.listingId
            : bookingData.listingId._id;

        const listingRes = await fetch(`${API_URL}/api/listings/${listingId}`);
        if (!listingRes.ok) throw new Error("Failed to load listing");
        const listingData = await listingRes.json();
        setListing(listingData);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async () => {
    if (!bookingId) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        alert("✅ Booking updated successfully!");
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`❌ Update failed: ${errData.error || "Unknown error"}`);
      }
    } catch (err) {
      alert("❌ Network error");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading...
      </div>
    );
  if (!booking || !listing)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Data not found
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-2xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Edit Booking</h1>
        <div className="bg-white p-8 rounded-lg shadow space-y-6">
          {/* Listing Info */}
          <div className="border-b pb-6">
            <img
              src={listing.images?.[0] || ""}
              alt={listing.title}
              className="w-32 h-32 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold">{listing.title}</h2>
            <p className="text-gray-600">{listing.location}</p>
          </div>

          {/* Status Update */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Booking Status
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={updateBooking} className="w-full">
            Update Booking Status
          </Button>
        </div>
      </main>
    </div>
  );
}

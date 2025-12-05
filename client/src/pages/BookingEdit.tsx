//client/src/pages/BookingEdit.tsx
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
import { AlertCircle, Loader2 } from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "https://stayease-1-mijo.onrender.com";

export default function BookingEdit() {
  const [, params] = useRoute("/booking-edit/:id");
  const bookingId = params?.id;

  const [booking, setBooking] = useState<any>(null);
  const [listing, setListing] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    if (bookingId) {
      fetchData(bookingId);
    } else {
      setError("❌ Invalid booking ID");
      setLoading(false);
    }
  }, [bookingId]);

  const fetchData = async (id: string) => {
    try {
      setLoading(true);
      setError("");
      
      const token = localStorage.getItem("token");
      console.log('🔑 TOKEN:', token ? 'EXISTS' : 'MISSING');
      setToken(token || '');
      
      if (!token) {
        setError("❌ Please login first");
        return;
      }

      console.log('📡 GET /api/bookings/', id);
      const bookingRes = await fetch(`${API_URL}/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('📡 Booking status:', bookingRes.status);
      
      if (!bookingRes.ok) {
        const errorText = await bookingRes.text();
        throw new Error(`Booking fetch failed: ${bookingRes.status} ${errorText}`);
      }
      
      const bookingData = await bookingRes.json();
      console.log('✅ Booking data:', bookingData);
      setBooking(bookingData);
      setStatus(bookingData.status);

      if (bookingData.listingId) {
        const listingId =
          typeof bookingData.listingId === "string"
            ? bookingData.listingId
            : bookingData.listingId._id;
        
        console.log('📡 GET /api/listings/', listingId);
        const listingRes = await fetch(`${API_URL}/api/listings/${listingId}`);
        console.log('📡 Listing status:', listingRes.status);
        
        if (!listingRes.ok) {
          console.warn('Listing fetch failed, using fallback');
          setListing({ title: 'Unknown Property', location: 'N/A' });
        } else {
          const listingData = await listingRes.json();
          setListing(listingData);
        }
      }
    } catch (err: any) {
      console.error('💥 FULL ERROR:', err);
      setError(err.message || "Failed to load booking data");
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async () => {
    if (!bookingId || !localStorage.getItem("token")) {
      setError("❌ No booking ID or token");
      return;
    }
    
    try {
      console.log('📡 PUT /api/bookings/', bookingId, { status });
      const res = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      
      console.log('📡 Update status:', res.status);
      
      if (res.ok) {
        alert("✅ Booking updated successfully!");
        setError("");
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || errData.message || `Update failed: ${res.status}`);
      }
    } catch (err: any) {
      console.error('💥 Update error:', err);
      setError(`Update failed: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading booking...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-2xl mx-auto p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-800 mb-2">Booking Edit</h1>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="space-y-2 mb-6">
              <p className="text-sm text-red-600">
                Booking ID: <code>{bookingId}</code>
              </p>
              <p className="text-sm text-red-600">
                Token: <span className={token ? 'text-green-600' : 'text-red-600'}>
                  {token ? 'Present' : 'Missing'}
                </span>
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => window.location.reload()}>Retry</Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!booking || !listing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-2xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Edit Booking #{bookingId}</h1>
        <div className="bg-white p-8 rounded-lg shadow space-y-6">
          <div className="border-b pb-6">
            <img
              src={listing.images?.[0] || ""}
              alt={listing.title}
              className="w-32 h-32 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold">{listing.title}</h2>
            <p className="text-gray-600">{listing.location}</p>
            <p className="text-sm text-muted-foreground">
              Dates: {booking.dates?.from} to {booking.dates?.to}
            </p>
          </div>

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

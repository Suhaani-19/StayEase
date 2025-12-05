//client/src/pages/Bookings.tsx

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import BookingHistoryCard from "@/components/BookingHistoryCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const API_URL = import.meta.env.VITE_API_URL || "https://stayease-1-mijo.onrender.com";

interface Booking {
  _id: string;
  listingId: {
    title: string;
    location: string;
    images?: string[];
    price?: number;
  };
  guestId?: {
    name: string;
    email?: string;
  };
  hostId?: {
    name: string;
  };
  dates: {
    from: string;
    to: string;
  };
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  guests?: number;
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      console.log('🔍 API_URL:', API_URL);
      
      const res = await fetch(`${API_URL}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
        throw new Error(`HTTP ${res.status}: Failed to fetch bookings`);
      }

      const data = await res.json();
      console.log('📋 Bookings response:', data);
      
      // 🔥 BULLETPROOF: Handle ALL response formats
      const bookingsArray = Array.isArray(data) 
        ? data 
        : data.bookings || data.data || [];
      
      setBookings(bookingsArray);
    } catch (err: any) {
      console.error("💥 Bookings fetch error:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getBookingsByStatus = (status: "pending" | "confirmed" | "cancelled") =>
    bookings.filter((booking) => booking.status === status);

  const getCardStatus = (
    backendStatus: string
  ): "upcoming" | "completed" | "cancelled" => {
    const status = backendStatus.toLowerCase();
    if (status.includes("pending")) return "upcoming";
    if (status.includes("confirm")) return "completed";
    if (status.includes("cancel")) return "cancelled";
    return "upcoming";
  };

  const handleCancelBooking = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await fetch(`${API_URL}/api/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Cancel failed: ${res.status}`);
      }

      setBookings((prev) => prev.filter((b) => b._id !== id));
      alert("✅ Booking cancelled successfully!");
    } catch (err: any) {
      console.error("💥 Cancel error:", err);
      alert(`❌ ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your upcoming, completed, and cancelled bookings
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-muted-foreground">No bookings yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Book your first stay and track it here.
            </p>
            <a href="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-xl font-medium transition-colors">
              Browse Listings
            </a>
          </div>
        ) : (
          <Tabs
            value={selectedTab}
            onValueChange={(value: string) => setSelectedTab(value as any)}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">
                Upcoming ({getBookingsByStatus("pending").length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({getBookingsByStatus("confirmed").length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled ({getBookingsByStatus("cancelled").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {getBookingsByStatus("pending").length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">No upcoming bookings</p>
              ) : (
                getBookingsByStatus("pending").map((booking) => (
                  <BookingHistoryCard
                    key={booking._id}
                    id={booking._id}
                    propertyName={booking.listingId.title}
                    location={booking.listingId.location}
                    image={booking.listingId.images?.[0] || ""}
                    checkIn={new Date(booking.dates.from).toLocaleDateString()}
                    checkOut={new Date(booking.dates.to).toLocaleDateString()}
                    guests={booking.guests || 2}
                    totalPrice={booking.totalPrice}
                    status={getCardStatus(booking.status)}
                    onCancel={handleCancelBooking}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {getBookingsByStatus("confirmed").length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">No completed bookings</p>
              ) : (
                getBookingsByStatus("confirmed").map((booking) => (
                  <BookingHistoryCard
                    key={booking._id}
                    id={booking._id}
                    propertyName={booking.listingId.title}
                    location={booking.listingId.location}
                    image={booking.listingId.images?.[0] || ""}
                    checkIn={new Date(booking.dates.from).toLocaleDateString()}
                    checkOut={new Date(booking.dates.to).toLocaleDateString()}
                    guests={booking.guests || 2}
                    totalPrice={booking.totalPrice}
                    status={getCardStatus(booking.status)}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-4">
              {getBookingsByStatus("cancelled").length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">No cancelled bookings</p>
              ) : (
                getBookingsByStatus("cancelled").map((booking) => (
                  <BookingHistoryCard
                    key={booking._id}
                    id={booking._id}
                    propertyName={booking.listingId.title}
                    location={booking.listingId.location}
                    image={booking.listingId.images?.[0] || ""}
                    checkIn={new Date(booking.dates.from).toLocaleDateString()}
                    checkOut={new Date(booking.dates.to).toLocaleDateString()}
                    guests={booking.guests || 2}
                    totalPrice={booking.totalPrice}
                    status={getCardStatus(booking.status)}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}

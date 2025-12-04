// client/src/pages/Bookings.tsx
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import BookingHistoryCard from "@/components/BookingHistoryCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const API_URL =
  import.meta.env.VITE_API_URL || "https://stayease-1-mijo.onrender.com";

// 🔥 TYPE DEFINITIONS
interface Booking {
  _id: string;
  listingId: {
    title: string;
    location: string;
    images?: string[];
  };
  guestId?: {
    name: string;
    email?: string;
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
  const [selectedTab, setSelectedTab] = useState<
    "upcoming" | "completed" | "cancelled"
  >("upcoming");
  const [, navigate] = useLocation();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const res = await fetch(`${API_URL}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch bookings");

      const data: Booking[] = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 TYPE-SAFE FILTERING
  const getBookingsByStatus = (
    status: "pending" | "confirmed" | "cancelled"
  ) => bookings.filter((booking) => booking.status === status);

  // 🔥 STATUS MAPPER (backend → card)
  const getCardStatus = (
    backendStatus: "pending" | "confirmed" | "cancelled"
  ): "upcoming" | "completed" | "cancelled" => {
    switch (backendStatus) {
      case "pending":
        return "upcoming";
      case "confirmed":
        return "completed";
      case "cancelled":
        return "cancelled";
      default:
        return "upcoming";
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/booking/${id}`);
  };

  const handleCancelBooking = async (id: string) => {
    const confirmed = window.confirm("Cancel this booking?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const res = await fetch(`${API_URL}/api/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to cancel booking");
      }

      // Remove booking from UI
      setBookings((prev) => prev.filter((b) => b._id !== id));
      alert("✅ Booking cancelled");
    } catch (err: any) {
      console.error(err);
      alert(`❌ ${err.message || "Error cancelling booking"}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

        <Tabs
          value={selectedTab}
          onValueChange={(value: string) => {
            setSelectedTab(
              value as "upcoming" | "completed" | "cancelled"
            );
          }}
          className="space-y-6"
        >
          <TabsList data-testid="tabs-bookings">
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

          {/* UPCOMING / PENDING */}
          <TabsContent value="upcoming" className="space-y-4">
            {getBookingsByStatus("pending").length === 0 ? (
              <p className="text-muted-foreground">No upcoming bookings</p>
            ) : (
              getBookingsByStatus("pending").map((booking) => (
                <BookingHistoryCard
                  key={booking._id}
                  id={booking._id}
                  propertyName={booking.listingId.title}
                  location={booking.listingId.location}
                  image={booking.listingId.images?.[0] || ""}
                  checkIn={new Date(
                    booking.dates.from
                  ).toLocaleDateString()}
                  checkOut={new Date(
                    booking.dates.to
                  ).toLocaleDateString()}
                  guests={booking.guests || 2}
                  totalPrice={booking.totalPrice}
                  status={getCardStatus(booking.status)}
                  onViewDetails={handleViewDetails}
                  onCancel={handleCancelBooking}
                />
              ))
            )}
          </TabsContent>

          {/* COMPLETED / CONFIRMED */}
          <TabsContent value="completed" className="space-y-4">
            {getBookingsByStatus("confirmed").length === 0 ? (
              <p className="text-muted-foreground">No completed bookings</p>
            ) : (
              getBookingsByStatus("confirmed").map((booking) => (
                <BookingHistoryCard
                  key={booking._id}
                  id={booking._id}
                  propertyName={booking.listingId.title}
                  location={booking.listingId.location}
                  image={booking.listingId.images?.[0] || ""}
                  checkIn={new Date(
                    booking.dates.from
                  ).toLocaleDateString()}
                  checkOut={new Date(
                    booking.dates.to
                  ).toLocaleDateString()}
                  guests={booking.guests || 2}
                  totalPrice={booking.totalPrice}
                  status={getCardStatus(booking.status)}
                  onViewDetails={handleViewDetails}
                />
              ))
            )}
          </TabsContent>

          {/* CANCELLED */}
          <TabsContent value="cancelled" className="space-y-4">
            {getBookingsByStatus("cancelled").length === 0 ? (
              <p className="text-muted-foreground">No cancelled bookings</p>
            ) : (
              getBookingsByStatus("cancelled").map((booking) => (
                <BookingHistoryCard
                  key={booking._id}
                  id={booking._id}
                  propertyName={booking.listingId.title}
                  location={booking.listingId.location}
                  image={booking.listingId.images?.[0] || ""}
                  checkIn={new Date(
                    booking.dates.from
                  ).toLocaleDateString()}
                  checkOut={new Date(
                    booking.dates.to
                  ).toLocaleDateString()}
                  guests={booking.guests || 2}
                  totalPrice={booking.totalPrice}
                  status={getCardStatus(booking.status)}
                  onViewDetails={handleViewDetails}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

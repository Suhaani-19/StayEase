import Header from "@/components/Header";
import BookingHistoryCard from "@/components/BookingHistoryCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import cabinImage from "@assets/generated_images/Mountain_cabin_listing_photo_0428adcd.png";
import villaImage from "@assets/generated_images/Beachfront_villa_listing_photo_b95534bf.png";
import loftImage from "@assets/generated_images/Urban_loft_listing_photo_1fd875a3.png";

export default function Bookings() {
  const upcomingBookings = [
    {
      id: "1",
      propertyName: "Cozy Mountain Cabin",
      location: "Aspen, Colorado",
      image: cabinImage,
      checkIn: "Dec 15, 2024",
      checkOut: "Dec 20, 2024",
      guests: 4,
      totalPrice: 945,
      status: "upcoming" as const,
    },
  ];

  const completedBookings = [
    {
      id: "2",
      propertyName: "Luxury Beachfront Villa",
      location: "Malibu, California",
      image: villaImage,
      checkIn: "Nov 1, 2024",
      checkOut: "Nov 5, 2024",
      guests: 2,
      totalPrice: 1800,
      status: "completed" as const,
    },
    {
      id: "3",
      propertyName: "Urban Loft with City Views",
      location: "New York, NY",
      image: loftImage,
      checkIn: "Oct 10, 2024",
      checkOut: "Oct 15, 2024",
      guests: 3,
      totalPrice: 1375,
      status: "completed" as const,
    },
  ];

  const cancelledBookings = [
    {
      id: "4",
      propertyName: "Charming Countryside Cottage",
      location: "Cotswolds, England",
      image: cabinImage,
      checkIn: "Sep 5, 2024",
      checkOut: "Sep 10, 2024",
      guests: 2,
      totalPrice: 825,
      status: "cancelled" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList data-testid="tabs-bookings">
            <TabsTrigger value="upcoming" data-testid="tab-upcoming">
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="completed" data-testid="tab-completed">
              Completed ({completedBookings.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled" data-testid="tab-cancelled">
              Cancelled ({cancelledBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.map((booking) => (
              <BookingHistoryCard key={booking.id} {...booking} />
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedBookings.map((booking) => (
              <BookingHistoryCard key={booking.id} {...booking} />
            ))}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {cancelledBookings.map((booking) => (
              <BookingHistoryCard key={booking.id} {...booking} />
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

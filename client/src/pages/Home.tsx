import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ListingCard from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import cabinImage from "@assets/generated_images/Mountain_cabin_listing_photo_0428adcd.png";
import villaImage from "@assets/generated_images/Beachfront_villa_listing_photo_b95534bf.png";
import loftImage from "@assets/generated_images/Urban_loft_listing_photo_1fd875a3.png";
import cottageImage from "@assets/generated_images/Countryside_cottage_listing_photo_827759a0.png";
import studioImage from "@assets/generated_images/Studio_apartment_listing_photo_68967da2.png";

export default function Home() {
  const listings = [
    {
      id: "1",
      title: "Cozy Mountain Cabin",
      location: "Aspen, Colorado",
      price: 189,
      rating: 4.9,
      reviewCount: 127,
      images: [cabinImage, villaImage],
      type: "Entire cabin",
    },
    {
      id: "2",
      title: "Luxury Beachfront Villa",
      location: "Malibu, California",
      price: 450,
      rating: 4.8,
      reviewCount: 89,
      images: [villaImage, loftImage],
      type: "Entire villa",
    },
    {
      id: "3",
      title: "Urban Loft with City Views",
      location: "New York, NY",
      price: 275,
      rating: 4.7,
      reviewCount: 203,
      images: [loftImage, cottageImage],
      type: "Entire loft",
    },
    {
      id: "4",
      title: "Charming Countryside Cottage",
      location: "Cotswolds, England",
      price: 165,
      rating: 4.9,
      reviewCount: 156,
      images: [cottageImage, studioImage],
      type: "Entire cottage",
    },
    {
      id: "5",
      title: "Modern Studio Apartment",
      location: "Tokyo, Japan",
      price: 95,
      rating: 4.6,
      reviewCount: 98,
      images: [studioImage, cabinImage],
      type: "Entire studio",
    },
    {
      id: "6",
      title: "Seaside Beach House",
      location: "Miami, Florida",
      price: 320,
      rating: 4.8,
      reviewCount: 142,
      images: [villaImage, cottageImage],
      type: "Entire house",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Popular destinations</h2>
            <p className="text-muted-foreground">
              Discover our most loved accommodations
            </p>
          </div>
          <Button variant="outline" data-testid="button-view-all">
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              {...listing}
              isDemo
            />
          ))}
        </div>
      </main>
    </div>
  );
}

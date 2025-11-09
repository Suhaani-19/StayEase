import Header from "@/components/Header";
import SearchFilters from "@/components/SearchFilters";
import ListingCard from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import cabinImage from "@assets/generated_images/Mountain_cabin_listing_photo_0428adcd.png";
import villaImage from "@assets/generated_images/Beachfront_villa_listing_photo_b95534bf.png";
import loftImage from "@assets/generated_images/Urban_loft_listing_photo_1fd875a3.png";
import cottageImage from "@assets/generated_images/Countryside_cottage_listing_photo_827759a0.png";

export default function SearchResults() {
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
      images: [cottageImage, cabinImage],
      type: "Entire cottage",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            <span data-testid="text-results-count">124 stays</span> in Colorado
          </h1>
          <Button variant="outline" data-testid="button-sort">
            Sort by: Popular
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="hidden lg:block">
            <SearchFilters />
          </aside>

          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} {...listing} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

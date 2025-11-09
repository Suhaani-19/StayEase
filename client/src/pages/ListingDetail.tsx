import Header from "@/components/Header";
import BookingCard from "@/components/BookingCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, Wifi, Car, Waves, Wind, Users, Home } from "lucide-react";
import { useRoute } from "wouter";
import cabinImage from "@assets/generated_images/Mountain_cabin_listing_photo_0428adcd.png";
import villaImage from "@assets/generated_images/Beachfront_villa_listing_photo_b95534bf.png";
import loftImage from "@assets/generated_images/Urban_loft_listing_photo_1fd875a3.png";

export default function ListingDetail() {
  const [, params] = useRoute("/listing/:id");

  const listing = {
    id: params?.id || "1",
    title: "Cozy Mountain Cabin",
    location: "Aspen, Colorado",
    price: 189,
    rating: 4.9,
    reviewCount: 127,
    type: "Entire cabin",
    guests: 6,
    bedrooms: 3,
    beds: 4,
    baths: 2,
    images: [cabinImage, villaImage, loftImage, cabinImage],
    description:
      "Escape to this charming mountain cabin nestled in the heart of Aspen. Perfect for families or groups seeking a peaceful retreat with stunning mountain views. The cabin features rustic charm combined with modern amenities, including a fully equipped kitchen, cozy fireplace, and spacious deck.",
    amenities: [
      { icon: Wifi, label: "WiFi" },
      { icon: Car, label: "Free parking" },
      { icon: Waves, label: "Hot tub" },
      { icon: Wind, label: "Air conditioning" },
      { icon: Users, label: "Family friendly" },
      { icon: Home, label: "Entire place" },
    ],
    host: {
      name: "Sarah Johnson",
      joinedDate: "Joined in 2019",
      responseRate: "100%",
      responseTime: "Within an hour",
    },
    reviews: [
      {
        id: "1",
        author: "Michael Chen",
        rating: 5,
        date: "November 2024",
        comment: "Absolutely stunning cabin! The views were breathtaking and the amenities exceeded our expectations.",
      },
      {
        id: "2",
        author: "Emma Davis",
        rating: 5,
        date: "October 2024",
        comment: "Perfect mountain getaway. Sarah was an excellent host and very responsive.",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-serif font-semibold mb-2" data-testid="text-title">{listing.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-medium" data-testid="text-rating">{listing.rating}</span>
              <span className="text-muted-foreground">({listing.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span data-testid="text-location">{listing.location}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 rounded-xl overflow-hidden mb-8">
          <div className="col-span-2 row-span-2">
            <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
          </div>
          {listing.images.slice(1, 4).map((image, index) => (
            <div key={index}>
              <img src={image} alt={`${listing.title} ${index + 2}`} className="w-full h-48 object-cover" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">{listing.type} hosted by {listing.host.name}</h2>
              <div className="flex gap-4 text-muted-foreground mb-6">
                <span>{listing.guests} guests</span>
                <span>•</span>
                <span>{listing.bedrooms} bedrooms</span>
                <span>•</span>
                <span>{listing.beds} beds</span>
                <span>•</span>
                <span>{listing.baths} baths</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
            </div>

            <div className="border-t pt-8">
              <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
              <div className="grid grid-cols-2 gap-4">
                {listing.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <amenity.icon className="h-5 w-5 text-muted-foreground" />
                    <span>{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-8">
              <h3 className="text-xl font-semibold mb-6">Meet your host</h3>
              <div className="flex items-start gap-6 p-6 bg-muted/30 rounded-xl">
                <Avatar className="h-16 w-16">
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-lg mb-1">{listing.host.name}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{listing.host.joinedDate}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Response rate: {listing.host.responseRate}</div>
                    </div>
                    <div>
                      <div className="font-medium">Response time: {listing.host.responseTime}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-8">
              <div className="flex items-center gap-2 mb-6">
                <Star className="h-5 w-5 fill-current" />
                <span className="text-xl font-semibold">{listing.rating} · {listing.reviewCount} reviews</span>
              </div>
              <div className="space-y-6">
                {listing.reviews.map((review) => (
                  <div key={review.id} className="pb-6 border-b last:border-0">
                    <div className="flex items-start gap-4 mb-3">
                      <Avatar>
                        <AvatarFallback>{review.author.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{review.author}</div>
                        <div className="text-sm text-muted-foreground">{review.date}</div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-6" data-testid="button-show-reviews">
                Show all {listing.reviewCount} reviews
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <BookingCard
              pricePerNight={listing.price}
              rating={listing.rating}
              reviewCount={listing.reviewCount}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import BookingCard from "@/components/BookingCard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Star, Wifi, Car, Waves, Wind, Users, Home } from "lucide-react";
import { useRoute } from "wouter";

const API_URL =
  import.meta.env.VITE_API_URL || "https://stayease-1-mijo.onrender.com";

type Listing = {
  _id?: string;
  id?: string;
  title: string;
  location: string;
  price: number;
  rating?: number;
  reviewCount?: number;
  type?: string;
  guests?: number;
  bedrooms?: number;
  beds?: number;
  baths?: number;
  images?: string[];
  description?: string;

  // 👇 adjust these to whatever your backend returns
  ownerName?: string;
  owner?: {
    name?: string;
    joinedDate?: string;
    responseRate?: string;
    responseTime?: string;
  };
};

export default function ListingDetail() {
  const [, params] = useRoute("/listing/:id");
  const id = params?.id;

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch listing by id
  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_URL}/api/listings/${id}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || data.error || "Listing not found");
        }
        const data = await res.json();
        setListing(data);
      } catch (err: any) {
        setError(err.message || "Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (!id) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <p className="text-red-500">No listing id in URL.</p>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <p className="text-muted-foreground">Loading listing...</p>
        </main>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <p className="text-red-500">{error || "Listing not found."}</p>
        </main>
      </div>
    );
  }

  const {
    title,
    location,
    price,
    rating = 0,
    reviewCount = 0,
    type = "Entire place",
    guests = 2,
    bedrooms = 1,
    beds = 1,
    baths = 1,
    images = [],
    description = "",
    owner,
    ownerName,
  } = listing;

  const displayImages =
    images.length > 0
      ? images
      : [
          "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
          "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
          "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
        ];

  // 👇 derive host info dynamically from listing
  const hostName =
    owner?.name || ownerName || localStorage.getItem("userName") || "Host";
  const hostJoinedDate = owner?.joinedDate || "Joined recently";
  const hostResponseRate = owner?.responseRate || "100%";
  const hostResponseTime = owner?.responseTime || "Within an hour";

  const amenities = [
    { icon: Wifi, label: "WiFi" },
    { icon: Car, label: "Free parking" },
    { icon: Waves, label: "Hot tub" },
    { icon: Wind, label: "Air conditioning" },
    { icon: Users, label: "Family friendly" },
    { icon: Home, label: "Entire place" },
  ];

  const reviews = [
    {
      id: "1",
      author: "Michael Chen",
      rating: 5,
      date: "November 2024",
      comment:
        "Absolutely stunning place! Very comfortable and well located.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-6">
          <h1
            className="text-3xl font-serif font-semibold mb-2"
            data-testid="text-title"
          >
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-medium" data-testid="text-rating">
                {rating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">
                ({reviewCount} reviews)
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span data-testid="text-location">{location}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 rounded-xl overflow-hidden mb-8">
          <div className="col-span-2 row-span-2">
            <img
              src={displayImages[0]}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          {displayImages.slice(1, 4).map((image, index) => (
            <div key={index}>
              <img
                src={image}
                alt={`${title} ${index + 2}`}
                className="w-full h-48 object-cover"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                {type} hosted by {hostName}
              </h2>
              <div className="flex gap-4 text-muted-foreground mb-6">
                <span>{guests} guests</span>
                <span>•</span>
                <span>{bedrooms} bedrooms</span>
                <span>•</span>
                <span>{beds} beds</span>
                <span>•</span>
                <span>{baths} baths</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>

            <div className="border-t pt-8">
              <h3 className="text-xl font-semibold mb-4">
                What this place offers
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {amenities.map((amenity, index) => (
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
                  <AvatarFallback>
                    {hostName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-lg mb-1">{hostName}</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {hostJoinedDate}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium">
                        Response rate: {hostResponseRate}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">
                        Response time: {hostResponseTime}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-8">
              <div className="flex items-center gap-2 mb-6">
                <Star className="h-5 w-5 fill-current" />
                <span className="text-xl font-semibold">
                  {rating.toFixed(1)} · {reviewCount} reviews
                </span>
              </div>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="pb-6 border-b last:border-0">
                    <div className="flex items-start gap-4 mb-3">
                      <Avatar>
                        <AvatarFallback>
                          {review.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{review.author}</div>
                        <div className="text-sm text-muted-foreground">
                          {review.date}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="mt-6"
                data-testid="button-show-reviews"
              >
                Show all {reviewCount} reviews
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <BookingCard
              pricePerNight={price}
              rating={rating}
              reviewCount={reviewCount}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Star, MapPin } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

interface ListingCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  type: string;
}

export default function ListingCard({
  id,
  title,
  location,
  price,
  rating,
  reviewCount,
  images,
  type,
}: ListingCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
    console.log("Favorite toggled:", !isFavorite);
  };

  return (
    <Link href={`/listing/${id}`} data-testid={`link-listing-${id}`}>
      <Card className="overflow-hidden hover-elevate active-elevate-2 transition-all cursor-pointer">
        <div className="relative aspect-[4/3] overflow-hidden group">
          <img
            src={images[currentImageIndex]}
            alt={title}
            className="w-full h-full object-cover"
          />

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/90 backdrop-blur hover:bg-white"
            onClick={toggleFavorite}
            data-testid={`button-favorite-${id}`}
          >
            <Heart
              className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
            />
          </Button>

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                data-testid={`button-prev-${id}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                data-testid={`button-next-${id}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 w-1.5 rounded-full ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-serif font-semibold text-lg leading-tight line-clamp-1" data-testid={`text-title-${id}`}>
              {title}
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium" data-testid={`text-rating-${id}`}>{rating}</span>
              <span className="text-sm text-muted-foreground">({reviewCount})</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1" data-testid={`text-location-${id}`}>{location}</span>
          </div>

          <div className="text-sm text-muted-foreground mb-3">{type}</div>

          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-semibold" data-testid={`text-price-${id}`}>${price}</span>
            <span className="text-muted-foreground">/ night</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import BookingCard from "@/components/BookingCard";
import { Button } from "@/components/ui/button";
import { useRoute, Link } from "wouter";  // Import Link here
import { MapPin, Star, Wifi, Car, Waves, Wind, Users, Home } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const API_URL =
  import.meta.env.VITE_API_URL || "https://stayease-1-mijo.onrender.com";

type Review = {
  _id?: string;
  userId?: { name?: string };
  title: string;
  comment: string;
  rating: number;
};

export default function ListingDetail() {
  const [, params] = useRoute("/listing/:id");
  const id = params?.id;

  // Listing state as before
  // ...

  // New state for reviews list
  const [reviews, setReviews] = useState<Review[]>([]);

  // Fetch reviews when listing id changes
  useEffect(() => {
    if (!id) return;

    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_URL}/api/reviews?listingId=${id}`);
        const data = await res.json();
        setReviews(data.reviews || []);
      } catch (err) {
        console.error("Failed to load reviews", err);
      }
    };

    fetchReviews();
  }, [id]);

  // ... rest of your existing ListingDetail code

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Existing listing details code */}

        {/* Add reviews section below listing details */}
        <div className="border-t pt-8 mt-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Reviews ({reviews.length})</h3>
            <Link href={`/reviews/create?listingId=${id}`}>
              <Button>✍️ Write a Review</Button>
            </Link>
          </div>

          <div className="space-y-6">
            {reviews.length === 0 && <p>No reviews yet</p>}

            {reviews.map((review) => (
              <div key={review._id} className="pb-6 border-b last:border-0">
                <div className="flex items-start gap-4 mb-3">
                  <Avatar>
                    <AvatarFallback>
                      {review.userId?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{review.userId?.name || "Guest"}</div>
                    <div className="text-sm text-muted-foreground">
                      Rating: {review.rating}
                    </div>
                  </div>
                </div>
                <h4 className="font-semibold">{review.title}</h4>
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Existing booking card and other code */}
      </main>
    </div>
  );
}

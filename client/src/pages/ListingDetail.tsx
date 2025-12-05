//client/src/pages/ListingDetail.tsx
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import BookingCard from "@/components/BookingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRoute, Link } from "wouter";
import { MapPin, Star, Wifi, Car, Waves, Wind, Users, Home, Edit3, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const API_URL = import.meta.env.VITE_API_URL || "https://stayease-1-mijo.onrender.com";

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
  ownerName?: string;
  owner?: {
    name?: string;
    joinedDate?: string;
    responseRate?: string;
    responseTime?: string;
  };
};

type Review = {
  _id?: string;
  userId?: { _id?: string; name?: string };
  title: string;
  comment: string;
  rating: number;
  createdAt?: string;
};

export default function ListingDetail() {
  const [, params] = useRoute("/listing/:id");
  const id = params?.id;

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', comment: '', rating: 5 });

  // ✅ GET CURRENT USER
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId || null);
  }, []);

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

  // ✅ FETCH REVIEWS FOR THIS LISTING
  useEffect(() => {
    if (!id) return;

    const fetchReviews = async () => {
      try {
        const params = new URLSearchParams({ listingId: id });
        const res = await fetch(`${API_URL}/api/reviews?${params}`);
        const data = await res.json();
        setReviews(data.reviews || []);
      } catch (err) {
        console.error("Failed to load reviews", err);
      }
    };

    fetchReviews();
  }, [id]);

  // ✅ CHECK IF CURRENT USER OWNS REVIEW
  const isCurrentUserReview = (review: Review) => {
    return userId && review.userId?._id === userId;
  };

  // ✅ HANDLE EDIT REVIEW
  const handleEditReview = async (reviewId: string) => {
    if (!editForm.title || !editForm.comment) {
      alert("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        // Refresh reviews
        const params = new URLSearchParams({ listingId: id! });
        const reviewRes = await fetch(`${API_URL}/api/reviews?${params}`);
        const data = await reviewRes.json();
        setReviews(data.reviews || []);
        setEditingReviewId(null);
      } else {
        alert("Edit failed");
      }
    } catch (err) {
      alert("Edit failed - check console");
      console.error("Edit error:", err);
    }
  };

  // ✅ HANDLE DELETE REVIEW
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // Refresh reviews
        const params = new URLSearchParams({ listingId: id! });
        const reviewRes = await fetch(`${API_URL}/api/reviews?${params}`);
        const data = await reviewRes.json();
        setReviews(data.reviews || []);
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      alert("Delete failed - check console");
      console.error("Delete error:", err);
    }
  };

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

  const hostName = owner?.name || ownerName || localStorage.getItem("userName") || "Host";
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-serif font-semibold mb-2" data-testid="text-title">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-medium" data-testid="text-rating">
                {rating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">({reviews.length} reviews)</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span data-testid="text-location">{location}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 rounded-xl overflow-hidden mb-8">
          <div className="col-span-2 row-span-2">
            <img src={displayImages[0]} alt={title} className="w-full h-full object-cover" />
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
            {/* YOUR EXISTING LISTING CONTENT */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">{type} hosted by {hostName}</h2>
              <div className="flex gap-4 text-muted-foreground mb-6">
                <span>{guests} guests</span>
                <span>•</span>
                <span>{bedrooms} bedrooms</span>
                <span>•</span>
                <span>{beds} beds</span>
                <span>•</span>
                <span>{baths} baths</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{description}</p>
            </div>

            <div className="border-t pt-8">
              <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
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
                    {hostName.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-lg mb-1">{hostName}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{hostJoinedDate}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Response rate: {hostResponseRate}</div>
                    </div>
                    <div>
                      <div className="font-medium">Response time: {hostResponseTime}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ REVIEWS SECTION WITH EDIT/DELETE */}
            <div className="border-t pt-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold">Reviews ({reviews.length})</h3>
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span>
                        {(
                          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
                        ).toFixed(1)}{' '}
                        average
                      </span>
                    </div>
                  )}
                </div>
                <Link href={`/reviews/create?listingId=${id}`}>
                  <Button>✍️ Write a Review</Button>
                </Link>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-xl">
                  <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="bg-white p-6 rounded-xl shadow-sm border relative">
                      {/* ✅ REVIEW HEADER WITH ACTION BUTTONS */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3 flex-1">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {review.userId?.name?.split(" ").map((n) => n[0]).join("") || "G"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">{review.userId?.name || "Guest"}</div>
                            <div className="flex text-yellow-400 text-lg">
                              {'★'.repeat(review.rating)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {review.createdAt 
                                ? new Date(review.createdAt).toLocaleDateString() 
                                : 'Recent'
                              }
                            </div>
                          </div>
                        </div>
                        
                        {/* ✅ EDIT/DELETE BUTTONS - ONLY FOR CURRENT USER */}
                        {isCurrentUserReview(review) && (
                          <div className="flex gap-2 ml-4 flex-shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingReviewId(review._id || null);
                                setEditForm({ 
                                  title: review.title, 
                                  comment: review.comment, 
                                  rating: review.rating 
                                });
                              }}
                              className="h-8 px-2 text-xs"
                            >
                              <Edit3 className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteReview(review._id!)}
                              className="h-8 px-2 text-xs"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* ✅ EDIT FORM OR REVIEW CONTENT */}
                      {editingReviewId === review._id ? (
                        <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
                          <Input
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            placeholder="Review title"
                            className="font-semibold"
                          />
                          <Textarea
                            value={editForm.comment}
                            onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                            rows={3}
                            placeholder="Your review..."
                          />
                          <div className="flex items-center gap-3">
                            <label className="text-sm font-medium">Rating:</label>
                            <Input
                              type="number"
                              min={1}
                              max={5}
                              value={editForm.rating}
                              onChange={(e) => setEditForm({ ...editForm, rating: +e.target.value })}
                              className="w-16"
                            />
                            <div className="flex text-yellow-400 text-lg ml-2">
                              {'★'.repeat(editForm.rating)}
                            </div>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              onClick={() => handleEditReview(review._id!)}
                              className="flex-1"
                            >
                              Save Changes
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingReviewId(null)}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h4 className="font-semibold text-lg mb-2">{review.title}</h4>
                          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <BookingCard
              listingId={listing._id || ""}
              pricePerNight={listing.price}
              rating={listing.rating || 4.5}
              reviewCount={reviews.length}
              image={listing.images?.[0] || ""}
              title={listing.title}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

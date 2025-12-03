import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Home, Calendar, Heart, Plus } from "lucide-react";
import { Link } from "wouter";
import cabinImage from "@assets/generated_images/Mountain_cabin_listing_photo_0428adcd.png";
import villaImage from "@assets/generated_images/Beachfront_villa_listing_photo_b95534bf.png";
import ListingCard from "@/components/ListingCard";
import AddListingForm from "../components/AddListingForm";

const API_URL =
  import.meta.env.VITE_API_URL || "https://stayease-1-mijo.onrender.com";

export default function Dashboard() {
  const [userName, setUserName] = useState("User");
  const [userInitial, setUserInitial] = useState("U");

  const [realListings, setRealListings] = useState<any[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);

  // Load user name and initial from localStorage on mount
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
      setUserInitial(storedName.charAt(0).toUpperCase());
    }
  }, []);

  // Fetch real listings from backend
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(`${API_URL}/api/listings`);
        if (response.ok) {
          const data = await response.json();
          setRealListings(data);
        }
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoadingListings(false);
      }
    };
    fetchListings();
  }, []);

  const handleEditListing = (id: string) => {
    window.location.href = `/edit-listing/${id}`;
  };

  const handleDeleteListing = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_URL}/api/listings/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || data.error || "Failed to delete listing");
      }

      // Remove from UI
      setRealListings((prev) => prev.filter((l) => (l._id || l.id) !== id));
    } catch (err: any) {
      alert(err.message || "Error deleting listing");
    }
  };

  const stats = [
    { label: "Total Bookings", value: "8", icon: Calendar },
    { label: "Active Listings", value: `${realListings.length}`, icon: Home },
    { label: "Saved Favorites", value: "12", icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-xl">{userInitial}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {userName}</h1>
              <p className="text-muted-foreground">
                Manage your bookings and listings
              </p>
            </div>
          </div>
          <Button asChild data-testid="button-create-listing">
            <Link href="/create-listing">
              <Plus className="h-4 w-4 mr-2" />
              Create Listing
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <p
                    className="text-3xl font-bold"
                    data-testid={`text-${stat.label
                      .toLowerCase()
                      .replace(/\s/g, "-")}`}
                  >
                    {stat.value}
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList data-testid="tabs-dashboard">
            <TabsTrigger value="listings" data-testid="tab-listings">
              My Listings
            </TabsTrigger>
            <TabsTrigger value="bookings" data-testid="tab-bookings">
              My Bookings
            </TabsTrigger>
            <TabsTrigger value="favorites" data-testid="tab-favorites">
              Favorites
            </TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">
              Settings
            </TabsTrigger>
          </TabsList>

          {/* LISTINGS TAB */}
          <TabsContent value="listings" className="space-y-6">
            <AddListingForm />

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Properties</h2>
              <Button variant="outline" data-testid="button-manage-listings">
                Manage All
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingListings ? (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  Loading your listings...
                </div>
              ) : realListings.length > 0 ? (
                realListings.map((listing: any) => {
                  const isOwner = listing.owner === localStorage.getItem("userId");
                  return (
                    <ListingCard
                      key={listing._id || listing.id}
                      {...listing}
                      images={
                        listing.images && listing.images.length > 0
                          ? listing.images
                          : [cabinImage, villaImage]
                      }
                      onEdit={isOwner ? handleEditListing : undefined}
                      onDelete={isOwner ? handleDeleteListing : undefined}
                    />
                  );
                })
              ) : (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No listings yet. Create one above!
                </div>
              )}
            </div>
          </TabsContent>

          {/* BOOKINGS TAB */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Upcoming Bookings</h2>
              <Link href="/bookings">
                <Button
                  variant="outline"
                  data-testid="button-view-all-bookings"
                >
                  View All
                </Button>
              </Link>
            </div>
            <Card className="p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No upcoming bookings</p>
            </Card>
          </TabsContent>

          {/* FAVORITES TAB */}
          <TabsContent value="favorites" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Saved Listings</h2>
            </div>
            <Card className="p-8 text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No saved listings yet</p>
            </Card>
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <Card className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  defaultValue={userName}
                  className="w-full h-9 px-3 rounded-md border bg-background"
                  data-testid="input-name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  defaultValue="john@example.com"
                  className="w-full h-9 px-3 rounded-md border bg-background"
                  data-testid="input-email"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <input
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  className="w-full h-9 px-3 rounded-md border bg-background"
                  data-testid="input-phone"
                />
              </div>
              <Button data-testid="button-save-settings">Save Changes</Button>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

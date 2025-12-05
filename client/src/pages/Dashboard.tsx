//client/src/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Home, Plus } from "lucide-react";
import { Link } from "wouter";
import ListingCard from "@/components/ListingCard";

const API_URL = import.meta.env.VITE_API_URL || "https://stayease-1-mijo.onrender.com";

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

  // Fetch user's own listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await fetch(`${API_URL}/api/listings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setRealListings(data);
        } else if (response.status === 401) {
          window.location.href = "/login";
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
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/listings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete listing");
      }

      setRealListings((prev) => prev.filter((l) => (l._id || l.id) !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const stats = [
    { label: "Active Listings", value: `${realListings.length}`, icon: Home },
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
              <p className="text-muted-foreground">Manage your properties</p>
            </div>
          </div>
          <Button asChild>
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
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="listings">My Properties</TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="mt-6">
            {loadingListings ? (
              <p className="text-muted-foreground">Loading your listings...</p>
            ) : realListings.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-xl">
                <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No listings yet. Create your first one!</p>
                <Button asChild className="mt-4">
                  <Link href="/create-listing">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Listing
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {realListings.map((listing) => (
                  <ListingCard
                    key={listing._id || listing.id}
                    {...listing}
                    onEdit={handleEditListing}
                    onDelete={handleDeleteListing}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

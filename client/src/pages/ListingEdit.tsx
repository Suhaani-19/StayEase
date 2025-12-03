import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import Header from "@/components/Header";

const API_URL = import.meta.env.VITE_API_URL || "https://stayease-1-mijo.onrender.com";

interface FormData {
  title: string;
  description: string;
  location: string;
  price: string;
  type: string;
  images: string[];
  availableFrom: string;
  availableTo: string;
}

const ListingEdit = () => {
  const [, params] = useRoute("/edit-listing/:id");
  const id = params?.id;
  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    location: "",
    price: "",
    type: "apartment",
    images: [""],
    availableFrom: "",
    availableTo: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  // 1. Load auth
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    console.log("🔑 AUTH:", { token: !!storedToken, userId: !!storedUserId });
    if (storedToken && storedUserId) {
      setToken(storedToken);
      setUserId(storedUserId);
    } else {
      setMessage("❌ Please login first");
      setInitialLoad(false);
    }
  }, []);

  // 2. Fetch listing - FIXED deps!
  useEffect(() => {
    console.log("🚀 CHECK:", { id, userId, token: !!token, initialLoad });
    if (!id || !userId || !token) return;  // 🔥 REMOVED initialLoad!

    const fetchListing = async () => {
      try {
        console.log("📡 FETCHING:", `${API_URL}/api/listings/${id}`);
        const res = await fetch(`${API_URL}/api/listings/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const listing = await res.json();
        console.log("✅ LISTING:", listing.title);
        
        setFormData({
          title: listing.title || "",
          description: listing.description || "",
          location: listing.location || "",
          price: listing.price?.toString() || "",
          type: listing.type || "apartment",
          images: listing.images || [""],
          availableFrom: listing.availableFrom ? new Date(listing.availableFrom).toISOString().split('T')[0] : "",
          availableTo: listing.availableTo ? new Date(listing.availableTo).toISOString().split('T')[0] : "",
        });
        setMessage("✅ Ready to edit!");
      } catch (err: any) {
        console.error("❌ FETCH ERROR:", err);
        setMessage(`❌ Failed to load: ${err.message}`);
      } finally {
        setInitialLoad(false);
      }
    };

    fetchListing();
  }, [id, userId, token]);  // 🔥 FIXED - no initialLoad dep!

  // REST OF YOUR CODE EXACTLY SAME...
  const handleSubmit = async (e: React.FormEvent) => {
    // ... your existing handleSubmit
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, images: [e.target.value] });
  };

  // 🔥 FIXED: Only check userId!
  if (!userId) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-2xl mx-auto p-6">
          <h2 className="text-2xl font-bold mb-6">Edit Listing</h2>
          <p>Please <a href="/login" className="text-blue-600">login</a> first</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Edit Listing #{id}</h2>
        {message && (
          <div className={`p-4 mb-4 rounded-lg ${
            message.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {message}
          </div>
        )}
        {/* YOUR FULL FORM JSX - EXACTLY SAME */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
          {/* ALL YOUR FORM FIELDS HERE - NO CHANGES */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required />
          </div>
          {/* ... rest of form exactly same ... */}
          <div className="flex gap-4">
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Updating..." : "Update Listing"}
            </button>
            <a href="/dashboard" className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-md text-center hover:bg-gray-600">Cancel</a>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ListingEdit;

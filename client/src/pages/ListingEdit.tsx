// src/pages/ListingEdit.tsx
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

  // Get user auth
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    if (storedToken && storedUserId) {
      setToken(storedToken);
      setUserId(storedUserId);
    }
  }, []);

  // Load existing listing if editing
  useEffect(() => {
    if (!id || !userId) return;

    const fetchListing = async () => {
      try {
        const res = await fetch(`${API_URL}/api/listings/${id}`);
        if (!res.ok) throw new Error("Listing not found");
        const listing = await res.json();
        
        setFormData({
          title: listing.title,
          description: listing.description,
          location: listing.location,
          price: listing.price.toString(),
          type: listing.type,
          images: listing.images || [""],
          availableFrom: new Date(listing.availableFrom).toISOString().split('T')[0],
          availableTo: new Date(listing.availableTo).toISOString().split('T')[0],
        });
      } catch (err) {
        setMessage("❌ Failed to load listing");
      } finally {
        setInitialLoad(false);
      }
    };

    fetchListing();
  }, [id, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !token || !id) {
      setMessage("❌ Please login first");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const userName = localStorage.getItem("userName") || "Host";
      const payload = {
        ...formData,
        price: Number(formData.price),
        owner: userId,
        availableFrom: new Date(formData.availableFrom).toISOString(),
        availableTo: new Date(formData.availableTo).toISOString(),
        ownerName: userName,
        ownerJoinedDate: "Joined in 2024",
        ownerResponseRate: "100%",
        ownerResponseTime: "Within an hour",
      };

      const response = await fetch(`${API_URL}/api/listings/${id}`, {
        method: "PUT", // 👈 UPDATE instead of POST
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update listing");
      }

      setMessage("✅ Listing updated successfully!");
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, images: [e.target.value] });
  };

  if (!userId || (id && initialLoad)) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-2xl mx-auto p-6">
          <h2 className="text-2xl font-bold mb-6">Edit Listing</h2>
          {initialLoad && <p>Loading listing...</p>}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Edit Listing</h2>
        
        {message && (
          <div className={`p-4 mb-4 rounded-lg ${
            message.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
          {/* Same form fields as AddListingForm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="hotel">Hotel</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input type="url" value={formData.images[0]} onChange={handleImageChange} placeholder="https://example.com/image.jpg" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Available From</label>
              <input type="date" name="availableFrom" value={formData.availableFrom} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Available To</label>
              <input type="date" name="availableTo" value={formData.availableTo} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 font-medium"
            >
              {loading ? "Updating..." : "Update Listing"}
            </button>
            <a href="/dashboard" className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-md text-center hover:bg-gray-600 font-medium">
              Cancel
            </a>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ListingEdit;

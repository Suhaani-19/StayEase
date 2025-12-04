import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import Header from "@/components/Header";

const API_URL =
  import.meta.env.VITE_API_URL || "https://stayease-1-mijo.onrender.com";

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

  // Load auth
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    if (storedToken && storedUserId) {
      setToken(storedToken);
      setUserId(storedUserId);
    } else {
      setMessage("❌ Please login first");
      setInitialLoad(false);
    }
  }, []);

  // Fetch listing
  useEffect(() => {
    if (!id || !userId || !token) return;

    const fetchListing = async () => {
      try {
        const res = await fetch(`${API_URL}/api/listings/${id}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || data.error || `HTTP ${res.status}`);
        }
        const listing = await res.json();

        setFormData({
          title: listing.title || "",
          description: listing.description || "",
          location: listing.location || "",
          price: listing.price?.toString() || "",
          type: listing.type || "apartment",
          images: listing.images || [""],
          availableFrom: listing.availableFrom
            ? new Date(listing.availableFrom).toISOString().split("T")[0]
            : "",
          availableTo: listing.availableTo
            ? new Date(listing.availableTo).toISOString().split("T")[0]
            : "",
        });
        setMessage("✅ Ready to edit!");
      } catch (err: any) {
        console.error("Fetch listing error:", err);
        setMessage(`❌ Failed to load: ${err.message}`);
      } finally {
        setInitialLoad(false);
      }
    };

    fetchListing();
  }, [id, userId, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !token) return;

    setLoading(true);
    setMessage("");

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        availableFrom: new Date(formData.availableFrom).toISOString(),
        availableTo: new Date(formData.availableTo).toISOString(),
      };

      const res = await fetch(`${API_URL}/api/listings/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || data.error || "Failed to update");
      }

      setMessage("✅ Listing updated successfully!");
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, images: [e.target.value] }));
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-2xl mx-auto p-6">
          <h2 className="text-2xl font-bold mb-6">Edit Listing</h2>
          <p>
            Please{" "}
            <a href="/login" className="text-blue-600">
              login
            </a>{" "}
            first
          </p>
        </main>
      </div>
    );
  }

  if (initialLoad) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-2xl mx-auto p-6">
          <p className="text-muted-foreground">Loading listing...</p>
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
          <div
            className={`p-4 mb-4 rounded-lg ${
              message.includes("✅")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-6 rounded-lg shadow-md"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="hotel">Hotel</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={formData.images[0]}
                onChange={handleImageChange}
                placeholder="https://example.com/image.jpg"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available From
              </label>
              <input
                type="date"
                name="availableFrom"
                value={formData.availableFrom}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available To
              </label>
              <input
                type="date"
                name="availableTo"
                value={formData.availableTo}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Listing"}
            </button>
            <a
              href="/dashboard"
              className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-md text-center hover:bg-gray-600"
            >
              Cancel
            </a>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ListingEdit;

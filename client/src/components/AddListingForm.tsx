import { useState, useEffect } from "react";

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

const API_URL = import.meta.env.VITE_API_URL || "https://stayease-1-mijo.onrender.com";

const AddListingForm = () => {
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

  // Get user ID and token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    
    if (storedToken && storedUserId) {
      setToken(storedToken);
      setUserId(storedUserId);
    } else {
      setMessage("❌ Please login first");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!userId || !token) {
      setMessage("❌ Please login first");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        owner: userId,
        availableFrom: new Date(formData.availableFrom).toISOString(),
        availableTo: new Date(formData.availableTo).toISOString(),
      };

      // ✅ Using Fetch API instead of axios
      const response = await fetch(`${API_URL}/api/listings`, { // Fixed endpoint
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || "Failed to create listing");
      }

      const data = await response.json();
      setMessage(`✅ Listing created! ID: ${data._id || data.id}`);
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        location: "",
        price: "",
        type: "apartment",
        images: [""],
        availableFrom: "",
        availableTo: "",
      });
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, images: [e.target.value] });
  };

  if (!userId) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Listing</h2>
        <div className="p-4 mb-4 rounded-lg bg-orange-100 text-orange-800">
          Please <a href="/login" className="font-semibold underline">login</a> to create listings.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Listing</h2>
      
      {message && (
        <div
          className={`p-4 mb-4 rounded-lg ${
            message.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input 
              type="url" 
              value={formData.images[0]} 
              onChange={handleImageChange} 
              placeholder="https://example.com/image.jpg" 
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Available From</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Available To</label>
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 font-medium"
        >
          {loading ? "Creating..." : "Create Listing"}
        </button>
      </form>
    </div>
  );
};

export default AddListingForm;

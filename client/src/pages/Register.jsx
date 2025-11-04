import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
   await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, formData);
    alert("User registered successfully!");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <input type="text" placeholder="Name" value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border p-2 mb-4 rounded" />
        <input type="email" placeholder="Email" value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full border p-2 mb-4 rounded" />
        <input type="password" placeholder="Password" value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full border p-2 mb-6 rounded" />
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">
          Sign Up
        </button>
      </form>
    </div>
  );
}

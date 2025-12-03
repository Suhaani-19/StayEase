// server/scripts/seedListings.ts
import mongoose from "mongoose";
import { Listing } from "../models/Listing"; // adjust path to your Listing model

const MONGODB_URI = process.env.MONGODB_URI || "your-mongodb-connection-string";

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Optional: clear existing listings so you don't duplicate
    // await Listing.deleteMany({});

    const listings = [
      {
        title: "Cozy Mountain Cabin",
        description: "A warm cabin in the mountains with stunning views.",
        location: "Aspen, Colorado",
        price: 189,
        type: "house", // match your enum: "apartment" | "house" | "villa" | "hotel"
        owner: new mongoose.Types.ObjectId(), // or an existing User _id
        images: [
          "https://your-cdn-or-image-url/cabin-1.jpg",
        ],
        availableFrom: new Date(),
        availableTo: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
        ownerName: "Demo Host",
        ownerJoinedDate: "Joined in 2024",
        ownerResponseRate: "100%",
        ownerResponseTime: "Within an hour",
      },
      {
        title: "Luxury Beachfront Villa",
        description: "A luxury villa directly on the beach with a private pool.",
        location: "Malibu, California",
        price: 450,
        type: "villa",
        owner: new mongoose.Types.ObjectId(),
        images: [
          "https://your-cdn-or-image-url/villa-1.jpg",
        ],
        availableFrom: new Date(),
        availableTo: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
        ownerName: "Demo Host",
        ownerJoinedDate: "Joined in 2024",
        ownerResponseRate: "100%",
        ownerResponseTime: "Within an hour",
      },
      {
        title: "Urban Loft with City Views",
        description: "Modern loft with skyline views and industrial interior.",
        location: "New York, NY",
        price: 275,
        type: "apartment",
        owner: new mongoose.Types.ObjectId(),
        images: [
          "https://your-cdn-or-image-url/loft-1.jpg",
        ],
        availableFrom: new Date(),
        availableTo: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
        ownerName: "Demo Host",
        ownerJoinedDate: "Joined in 2024",
        ownerResponseRate: "100%",
        ownerResponseTime: "Within an hour",
      },
      {
        title: "Charming Countryside Cottage",
        description: "Quaint cottage surrounded by gardens and rolling hills.",
        location: "Cotswolds, England",
        price: 165,
        type: "house",
        owner: new mongoose.Types.ObjectId(),
        images: [
          "https://your-cdn-or-image-url/cottage-1.jpg",
        ],
        availableFrom: new Date(),
        availableTo: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
        ownerName: "Demo Host",
        ownerJoinedDate: "Joined in 2024",
        ownerResponseRate: "100%",
        ownerResponseTime: "Within an hour",
      },
      {
        title: "Modern Studio Apartment",
        description: "Compact studio with everything you need in the city.",
        location: "Tokyo, Japan",
        price: 95,
        type: "apartment",
        owner: new mongoose.Types.ObjectId(),
        images: [
          "https://your-cdn-or-image-url/studio-1.jpg",
        ],
        availableFrom: new Date(),
        availableTo: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
        ownerName: "Demo Host",
        ownerJoinedDate: "Joined in 2024",
        ownerResponseRate: "100%",
        ownerResponseTime: "Within an hour",
      },
      {
        title: "Seaside Beach House",
        description: "Bright beach house just steps from the sand.",
        location: "Miami, Florida",
        price: 320,
        type: "house",
        owner: new mongoose.Types.ObjectId(),
        images: [
          "https://your-cdn-or-image-url/beachhouse-1.jpg",
        ],
        availableFrom: new Date(),
        availableTo: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
        ownerName: "Demo Host",
        ownerJoinedDate: "Joined in 2024",
        ownerResponseRate: "100%",
        ownerResponseTime: "Within an hour",
      },
    ];

    const created = await Listing.insertMany(listings);
    console.log(`✅ Seeded ${created.length} listings`);

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seed();

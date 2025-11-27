import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    price_per_night: { type: Number, required: true },
    amenities: { type: [String], required: true },
    photos: { type: [String], required: true },
    available_from: { type: Date, required: true },
    available_to: { type: Date, required: true },
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Listing = mongoose.model("Listing", listingSchema);

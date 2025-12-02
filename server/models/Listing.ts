import mongoose, { Schema, Document } from "mongoose";

export interface IListing extends Document {
  title: string;
  description: string;
  location: string;
  price: number;
  type: "apartment" | "house" | "villa" | "hotel";
  owner: mongoose.Types.ObjectId;     // reference to User
  images: string[];
  availableFrom: Date;
  availableTo: Date;
}

const listingSchema = new Schema<IListing>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, enum: ["apartment", "house", "villa", "hotel"], required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    images: [{ type: String }],
    availableFrom: { type: Date, required: true },
    availableTo: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Listing = mongoose.model<IListing>("Listing", listingSchema);

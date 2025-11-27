// server/models/Property.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IProperty extends Document {
  title: string;
  description: string;
  location: string;
  pricePerNight: number;
  type: string; // hotel/room/apartment
  amenities: string[];
  images: string[]; // urls or upload paths
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  availableFrom?: Date;
  availableTo?: Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    type: { type: String, required: true },
    amenities: { type: [String], default: [] },
    images: { type: [String], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    availableFrom: { type: Date },
    availableTo: { type: Date },
  },
  { timestamps: true }
);

export const Property = mongoose.model<IProperty>("Property", PropertySchema);

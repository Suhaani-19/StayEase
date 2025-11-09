// server/storage.ts
import { Schema, model, Document } from "mongoose";

// USER MODEL
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", UserSchema);

// STAY MODEL
export interface IStay extends Document {
  title: string;
  location: string;
  price: number;
  owner: Schema.Types.ObjectId;
}

const StaySchema = new Schema<IStay>(
  {
    title: { type: String, required: true },
    location: String,
    price: Number,
    owner: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Stay = model<IStay>("Stay", StaySchema);

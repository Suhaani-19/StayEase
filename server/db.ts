// server/db.ts
import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI ||  "mongodb+srv://suhaani_db_user:Sairam%401904@cluster0.ocgkjrm.mongodb.net/?appName=Cluster0";
  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

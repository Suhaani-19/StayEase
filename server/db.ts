import mongoose from "mongoose";

export const connectDB = async () => {
  const uri =
    process.env.MONGODB_URI ||
    "mongodb+srv://suhaani_db_user:Sairam1904@cluster0.ocgkjrm.mongodb.net/test?retryWrites=true&w=majority";

  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB:", mongoose.connection.name);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

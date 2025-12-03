// server/listingsRoutes.ts
import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { Listing } from "./models/Listing.js"; // adjust path to your model

const router = Router();

// ✅ GET /api/listings - List all listings
router.get("/", async (_req: Request, res: Response) => {
  try {
    const listings = await Listing.find().populate("owner", "name");
    res.json(listings);
  } catch (error: any) {
    console.error("Get listings error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET /api/listings/:id - Get single listing
router.get("/:id", async (req: Request, res: Response) => {
  try {
    // ✅ VALIDATE ObjectId FIRST
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        message: 'Invalid listing ID. Must be a valid MongoDB ObjectId (24 hex characters).' 
      });
    }

    const listing = await Listing.findById(req.params.id).populate("owner", "name");
    
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    
    res.json(listing);
  } catch (error: any) {
    console.error("Get listing error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ POST /api/listings - Create listing (protected)
router.post("/", async (req: Request, res: Response) => {
  try {
    const listing = new Listing(req.body);
    await listing.save();
    await listing.populate("owner", "name");
    res.status(201).json(listing);
  } catch (error: any) {
    console.error("Create listing error:", error);
    res.status(400).json({ message: error.message });
  }
});

// ✅ PUT /api/listings/:id - Update listing (protected)
router.put("/:id", async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid listing ID" });
    }

    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("owner", "name");

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(listing);
  } catch (error: any) {
    console.error("Update listing error:", error);
    res.status(400).json({ message: error.message });
  }
});

// ✅ DELETE /api/listings/:id - Delete listing (protected)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid listing ID" });
    }

    const listing = await Listing.findByIdAndDelete(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json({ message: "Listing deleted successfully" });
  } catch (error: any) {
    console.error("Delete listing error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

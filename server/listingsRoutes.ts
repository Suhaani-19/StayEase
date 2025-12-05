import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { Listing } from "./models/Listing.js";

const router = Router();

/* -----------------------------------------------------
   NEW: PUBLIC ENDPOINT → Get ALL listings (no login)
----------------------------------------------------- */
router.get("/all", async (_req: Request, res: Response) => {
  try {
    const listings = await Listing.find().populate("owner", "name");
    res.json(listings);
  } catch (error) {
    console.error("Get all listings error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* -----------------------------------------------------
   PROTECTED: Get only MY listings
----------------------------------------------------- */
router.get("/", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "").trim();
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const listings = await Listing.find({ owner: decoded.id }).populate(
      "owner",
      "name"
    );

    res.json(listings);
  } catch (error) {
    console.error("Get listings error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* -----------------------------------------------------
   Get single listing (public)
----------------------------------------------------- */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message:
          "Invalid listing ID. Must be a valid MongoDB ObjectId (24 hex characters).",
      });
    }

    const listing = await Listing.findById(req.params.id).populate(
      "owner",
      "name"
    );

    if (!listing) return res.status(404).json({ message: "Listing not found" });

    res.json(listing);
  } catch (error) {
    console.error("Get listing error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* -----------------------------------------------------
   Create listing (protected)
----------------------------------------------------- */
router.post("/", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "").trim();
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const listing = new Listing({
      ...req.body,
      owner: decoded.id,
    });

    await listing.save();
    await listing.populate("owner", "name");

    res.status(201).json(listing);
  } catch (error: any) {
    console.error("Create listing error:", error);
    res.status(400).json({ message: error.message });
  }
});

/* -----------------------------------------------------
   Update listing (protected + owner only)
----------------------------------------------------- */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "Invalid listing ID" });

    const token = req.headers.authorization?.replace("Bearer ", "").trim();
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const listing = await Listing.findOneAndUpdate(
      { _id: req.params.id, owner: decoded.id },
      req.body,
      { new: true, runValidators: true }
    ).populate("owner", "name");

    if (!listing)
      return res
        .status(403)
        .json({ message: "Not authorized or listing not found" });

    res.json(listing);
  } catch (error: any) {
    console.error("Update listing error:", error);
    res.status(400).json({ message: error.message });
  }
});

/* -----------------------------------------------------
   Delete listing (protected + owner only)
----------------------------------------------------- */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "Invalid listing ID" });

    const token = req.headers.authorization?.replace("Bearer ", "").trim();
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const listing = await Listing.findOneAndDelete({
      _id: req.params.id,
      owner: decoded.id,
    });

    if (!listing)
      return res
        .status(403)
        .json({ message: "Not authorized or listing not found" });

    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("Delete listing error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

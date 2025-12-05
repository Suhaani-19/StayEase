//server/listingsRoutes.ts
import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import {Listing} from "./models/Listing.js";

const router = Router();

/* -----------------------------------------------------
   🔍 SEARCH LISTINGS (PUBLIC) — MUST BE FIRST
----------------------------------------------------- */
router.get("/search", async (req: Request, res: Response) => {
  try {
    const {
      keyword,
      location,
      minPrice,
      maxPrice,
      type,
      startDate,
      endDate,
      sort,
    } = req.query;

    const filter: any = {};

    // Keyword search
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword as string, $options: "i" } },
        { description: { $regex: keyword as string, $options: "i" } },
        { location: { $regex: keyword as string, $options: "i" } },
      ];
    }

    // Location filter
    if (location) filter.location = { $regex: location as string, $options: "i" };

    // Type filter
    if (type) filter.type = type;

    // Price filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (!isNaN(Number(minPrice))) filter.price.$gte = Number(minPrice);
      if (!isNaN(Number(maxPrice))) filter.price.$lte = Number(maxPrice);
    }

    // Date filter (availability)
    let start: Date | null = null;
    let end: Date | null = null;

    if (startDate) {
      const d = new Date(startDate as string);
      if (!isNaN(d.getTime())) start = d;
    }

    if (endDate) {
      const d = new Date(endDate as string);
      if (!isNaN(d.getTime())) end = d;
    }

    if (start && end) {
      filter.$and = [
        { availableFrom: { $lte: end } },
        { availableTo: { $gte: start } },
      ];
    } else if (start) {
      filter.availableTo = { $gte: start };
    } else if (end) {
      filter.availableFrom = { $lte: end };
    }

    // Sorting
    let sortOption: any = { createdAt: -1 };
    switch (sort) {
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "price_low_high":
        sortOption = { price: 1 };
        break;
      case "price_high_low":
        sortOption = { price: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    console.log("SEARCH FILTER:", JSON.stringify(filter, null, 2));

    const listings = await Listing.find(filter).populate("owner", "name").sort(sortOption);
    res.json({ listings });
  } catch (err: any) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error" });
  }
});



/* -----------------------------------------------------
   PUBLIC → Get ALL listings (no login)
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
   PROTECTED → Only MY listings
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
   Get single listing (PUBLIC)
----------------------------------------------------- */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "Invalid listing ID" });

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
   Create listing (PROTECTED)
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
   Update listing (PROTECTED + owner only)
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
   Delete listing (PROTECTED + owner only)
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

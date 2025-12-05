import express, { Request, Response } from "express";
import { Booking } from "./models/Booking.js";
import { Listing } from "./models/Listing.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// ✅ CREATE - Auto-assigns guestId from token
router.post("/", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "").trim();
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const guestId = decoded.id;

    const { listingId, dates, totalPrice, status, guests } = req.body;

    // Basic validation
    if (
      !listingId ||
      !dates?.from ||
      !dates?.to ||
      typeof totalPrice !== "number"
    ) {
      return res
        .status(400)
        .json({ error: "listingId, dates.from, dates.to and totalPrice are required" });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res
        .status(400)
        .json({ error: "listingId must be valid MongoDB ObjectId" });
    }

    // Find listing to derive hostId
    const listing = await Listing.findById(listingId).select("owner");
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const booking = await Booking.create({
      listingId,
      hostId: listing.owner,        // derive from listing.owner
      guestId,                      // ✅ from token
      dates: {
        from: new Date(dates.from),
        to: new Date(dates.to),
      },
      totalPrice,
      status: status || "pending",
      guests: guests || 1,
    });

    const populated = await Booking.findById(booking._id)
      .populate("listingId", "title location price images")
      .populate("guestId", "name email")
      .populate("hostId", "name");

    return res.status(201).json(populated);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create booking";
    return res.status(400).json({ error: message });
  }
});

// ✅ READ ALL - MY bookings only (guest's bookings)
router.get("/", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "").trim();
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const userId = decoded.id;

    const { status, page = "1", limit = "10" } = req.query;

    const filter: Record<string, any> = { guestId: userId }; // ✅ only MY bookings
    if (status) filter.status = status;

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    const bookings = await Booking.find(filter)
      .populate("listingId", "title location price images")
      .populate("guestId", "name email")
      .populate("hostId", "name")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await Booking.countDocuments(filter);

    return res.json({
      bookings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch bookings";
    return res.status(500).json({ error: message });
  }
});

// ✅ READ ONE
router.get("/:id", async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }

    const booking = await Booking.findById(req.params.id)
      .populate("listingId", "title location images price")
      .populate("guestId", "name email")
      .populate("hostId", "name");

    if (!booking) {
      return res.status(404).json({ error: "Not found" });
    }
    
    return res.json(booking);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch booking";
    return res.status(500).json({ error: message });
  }
});

// ✅ UPDATE - Only guest can update own booking
router.put("/:id", async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }

    const token = req.headers.authorization?.replace("Bearer ", "").trim();
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const updated = await Booking.findOneAndUpdate(
      { _id: req.params.id, guestId: decoded.id }, // ✅ only guest can edit
      { ...req.body, updatedAt: new Date() },
      { new: true }
    )
    .populate("listingId", "title location")
    .populate("guestId", "name")
    .populate("hostId", "name");

    if (!updated) {
      return res.status(403).json({ error: "Not authorized or not found" });
    }
    
    return res.json(updated);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to update booking";
    return res.status(500).json({ error: message });
  }
});

// ✅ DELETE - Only guest can cancel own booking
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }

    const token = req.headers.authorization?.replace("Bearer ", "").trim();
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const deleted = await Booking.findOneAndDelete({
      _id: req.params.id,
      guestId: decoded.id  // ✅ only guest can cancel
    });

    if (!deleted) {
      return res.status(403).json({ error: "Not authorized or not found" });
    }
    
    return res.json({ message: "Booking cancelled" });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to delete booking";
    return res.status(500).json({ error: message });
  }
});

export default router;

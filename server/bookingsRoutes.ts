// server/bookingsRoutes.ts
import express, { Request, Response } from "express";
import { Booking } from "./models/Booking.js"; // CREATE THIS MODEL NEXT

const router = express.Router();

// CREATE
router.post("/", async (req: Request, res: Response) => {
  try {
    const booking = await Booking.create(req.body);
    return res.status(201).json(booking);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create booking";
    return res.status(400).json({ error: message });
  }
});

// READ ALL (host's bookings)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { status, page = "1", limit = "10" } = req.query;
    
    const filter: Record<string, any> = {};
    if (status) filter.status = status;

    let query = Booking.find(filter)
      .populate('listingId', 'title location price')
      .populate('guestId', 'name email')
      .sort({ createdAt: -1 });

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    
    query = query.skip((pageNum - 1) * limitNum).limit(limitNum);

    const bookings = await query;
    return res.json(bookings);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch bookings";
    return res.status(500).json({ error: message });
  }
});

// READ ONE
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('listingId', 'title location images')
      .populate('guestId', 'name email');
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

// UPDATE (status: pending/confirmed/cancelled)
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const updated = await Booking.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, updatedAt: new Date() }, 
      { new: true }
    ).populate('listingId guestId');
    if (!updated) {
      return res.status(404).json({ error: "Not found" });
    }
    return res.json(updated);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to update booking";
    return res.status(500).json({ error: message });
  }
});

// DELETE (cancel)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Not found" });
    }
    return res.json({ message: "Booking cancelled" });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to delete booking";
    return res.status(500).json({ error: message });
  }
});

export default router;

// server/listingsRoutes.ts
import express, { Request, Response } from "express";
import { Listing } from "./models/Listing.js"; // make sure this path is correct for your project

const router = express.Router();

// CREATE
router.post("/", async (req: Request, res: Response) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create listing";
    return res.status(400).json({ error: message });
  }
});

// READ ALL (with filters, sorting, pagination)
router.get("/", async (req: Request, res: Response) => {
  try {
    const {
      location,
      priceMin,
      priceMax,
      type,
      sortBy,
      page = "1",
      limit = "10",
    } = req.query;

    const filter: Record<string, any> = {};

    if (location) filter.location = location;
    if (type) filter.type = type;
    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = Number(priceMin);
      if (priceMax) filter.price.$lte = Number(priceMax);
    }

    let query = Listing.find(filter);

    if (sortBy && typeof sortBy === "string") {
      query = query.sort(sortBy);
    }

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    query = query.skip((pageNum - 1) * limitNum).limit(limitNum);

    const listings = await query;
    return res.json(listings);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch listings";
    return res.status(500).json({ error: message });
  }
});

// READ ONE
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: "Not found" });
    }
    return res.json(listing);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch listing";
    return res.status(500).json({ error: message });
  }
});

// UPDATE
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ error: "Not found" });
    }
    return res.json(updated);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to update listing";
    return res.status(500).json({ error: message });
  }
});

// DELETE
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deleted = await Listing.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Not found" });
    }
    return res.json({ message: "Listing deleted" });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to delete listing";
    return res.status(500).json({ error: message });
  }
});

export default router;

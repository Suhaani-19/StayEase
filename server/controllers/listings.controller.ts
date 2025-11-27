import { Request, Response } from "express";
import { Stay } from "../storage.js";

// CREATE Stay
export const createListing = async (req: Request, res: Response) => {
  try {
    const listing = await Stay.create(req.body);
    return res.status(201).json(listing);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
};

// GET all Stays with Pagination, Search, Filter, Sort
export const getListings = async (req: Request, res: Response) => {
  try {
    const {
      search = "",
      location,
      minPrice,
      maxPrice,
      sort = "latest",
      page = 1,
      limit = 10,
    } = req.query;

    const filter: any = {};

    // Search by Title
    if (search) filter.title = { $regex: String(search), $options: "i" };

    // Filter by Location
    if (location) filter.location = { $regex: String(location), $options: "i" };

    // Filter by Price Range
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

    // Sorting Logic
    const sortValue = String(sort);
    const sortOptions: any =
      sortValue === "price_low"
        ? { price: 1 }
        : sortValue === "price_high"
        ? { price: -1 }
        : { createdAt: -1 }; // latest

    const result = await Stay.find(filter)
      .sort(sortOptions)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    return res.json(result);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
};

// GET Stay by ID
export const getListingById = async (req: Request, res: Response) => {
  try {
    const listing = await Stay.findById(req.params.id);
    return res.json(listing);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
};

// UPDATE Stay by ID
export const updateListing = async (req: Request, res: Response) => {
  try {
    const listing = await Stay.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.json(listing);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
};

// DELETE Stay by ID
export const deleteListing = async (req: Request, res: Response) => {
  try {
    await Stay.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
};

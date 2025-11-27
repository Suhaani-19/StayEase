import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import type { Express } from "express";
import { createServer, type Server } from "http";
import mongoose from "mongoose";
import { User, Stay } from "./storage.js"; // ESM import
import {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
} from "./controllers/listings.controller.js";

export async function registerRoutes(app: Express): Promise<Server> {
  /* ===========================
     AUTH ROUTES
  ============================ */

  // Signup
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });

      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ name, email, password: hashedPassword });

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

      return res.status(201).json({
        message: "User created successfully",
        user: { id: newUser._id, name: newUser.name, email: newUser.email },
        token,
      });
    } catch (err: any) {
      console.error("Signup error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: "Email and password required" });

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

      return res.json({
        message: "Login successful",
        user: { id: user._id, name: user.name, email: user.email },
        token,
      });
    } catch (err: any) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  });

  /* ===========================
     USER ROUTES
  ============================ */

  // Get all users
  app.get("/api/users", async (_req, res) => {
    try {
      const users = await User.find();
      return res.json(users);
    } catch (err: any) {
      console.error("Get users error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Create user manually
  app.post("/api/users", async (req, res) => {
    try {
      const user = await User.create(req.body);
      return res.status(201).json(user);
    } catch (err: any) {
      console.error("Create user error:", err);
      return res.status(400).json({ message: err.message });
    }
  });

  /* ===========================
     STAY ROUTES (CRUD + Pagination/Search/Filter/Sort)
  ============================ */

  // Create stay
  app.post("/api/stays", async (req, res) => {
    try {
      const stay = await Stay.create(req.body);
      return res.status(201).json(stay);
    } catch (err: any) {
      console.error("Create stay error:", err);
      return res.status(400).json({ message: err.message });
    }
  });

  // Get all stays
  app.get("/api/stays", async (_req, res) => {
    try {
      const stays = await Stay.find().populate("owner");
      return res.json(stays);
    } catch (err: any) {
      console.error("Get stays error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Get stay by ID
  app.get("/api/stays/:id", async (req, res) => {
    try {
      const stay = await Stay.findById(req.params.id).populate("owner");
      if (!stay) return res.status(404).json({ message: "Stay not found" });
      return res.json(stay);
    } catch (err: any) {
      console.error("Get stay by ID error:", err);
      return res.status(400).json({ message: "Invalid stay ID" });
    }
  });

  // Update stay
  app.put("/api/stays/:id", async (req, res) => {
    try {
      const stay = await Stay.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!stay) return res.status(404).json({ message: "Stay not found" });
      return res.json(stay);
    } catch (err: any) {
      console.error("Update stay error:", err);
      return res.status(400).json({ message: "Update failed", details: err });
    }
  });

  // Delete stay
  app.delete("/api/stays/:id", async (req, res) => {
    try {
      const stay = await Stay.findByIdAndDelete(req.params.id);
      if (!stay) return res.status(404).json({ message: "Stay not found" });
      return res.json({ message: "Stay deleted successfully" });
    } catch (err: any) {
      console.error("Delete stay error:", err);
      return res.status(400).json({ message: "Delete failed", details: err });
    }
  });

  // Pagination + search + filter + sort
  app.get("/api/stays/search/all", async (req, res) => {
    try {
      const {
        search = "",
        location,
        minPrice,
        maxPrice,
        sort = "createdAt",
        order = "desc",
        page = 1,
        limit = 10,
      } = req.query;

      const filter: any = {};
      if (search) filter.title = { $regex: search, $options: "i" };
      if (location) filter.location = { $regex: location as string, $options: "i" };
      if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
      if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

      const stays = await Stay.find(filter)
        .populate("owner")
        .sort({ [sort as string]: order === "asc" ? 1 : -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

      const total = await Stay.countDocuments(filter);

      return res.json({
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        data: stays,
      });
    } catch (err: any) {
      console.error("Search stays error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  });
  /* ===========================
   LISTING ROUTES (CRUD + Filters)
============================ */

  app.post("/api/listings", createListing);
  app.get("/api/listings", getListings);
  app.get("/api/listings/:id", getListingById);
  app.put("/api/listings/:id", updateListing);
  app.delete("/api/listings/:id", deleteListing);

  
  /* ===========================
     HTTP SERVER
  ============================ */
  const httpServer = createServer(app);
  return httpServer;
}

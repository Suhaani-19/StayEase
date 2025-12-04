import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { User, Stay } from "./storage.js";
import listingsRouter from "./listingsRoutes.js";
import bookingsRoutes from "./bookingsRoutes.js";
import mongoose from "mongoose";
import Review from "./models/Review.js";

// --------------------------------------------------
// AUTH MIDDLEWARE
// --------------------------------------------------

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = header.replace("Bearer ", "").trim();
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    (req as any).userId = decoded.id;
    next();
  } catch {
    return res.status(403).json({ error: "Invalid token" });
  }
};

// Protect listings create/update/delete
listingsRouter.post("/", authMiddleware);
listingsRouter.put("/:id", authMiddleware);
listingsRouter.delete("/:id", authMiddleware);

// --------------------------------------------------
// REVIEW ROUTES (FULL CRUD + OWNERSHIP)
// --------------------------------------------------

const setupReviewRoutes = (app: Express) => {
  // GET /api/reviews?listingId=&page=&limit=&search=&sort=&order=
  app.get("/api/reviews", async (req: Request, res: Response) => {
    try {
      const {
        listingId,
        page = "1",
        limit = "10",
        search = "",
        sort = "createdAt",
        order = "desc",
      } = req.query as any;

      const query: any = {};

      if (listingId && mongoose.Types.ObjectId.isValid(listingId)) {
        query.listingId = new mongoose.Types.ObjectId(listingId);
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { comment: { $regex: search, $options: "i" } },
        ];
      }

      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 10;

      const reviews = await Review.find(query)
        .populate("userId", "name email")
        .populate("listingId", "title location")
        .sort({ [sort]: order === "asc" ? 1 : -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

      const total = await Review.countDocuments(query);

      return res.json({
        reviews,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      });
    } catch (error: any) {
      console.error("GET /api/reviews error:", error);
      return res.status(500).json({ error: error.message });
    }
  });

  // POST /api/reviews  (CREATE) – requires auth, uses real userId
  app.post("/api/reviews", authMiddleware, async (req: Request, res: Response) => {
    try {
      const { title, comment, rating, listingId } = req.body;
      const userId = (req as any).userId as string;

      if (!listingId || !mongoose.Types.ObjectId.isValid(listingId)) {
        return res.status(400).json({ error: `Invalid listingId: ${listingId}` });
      }

      if (!title || !comment || typeof rating === "undefined") {
        return res
          .status(400)
          .json({ error: "title, comment and rating are required" });
      }

      const review = await Review.create({
        title,
        comment,
        rating: Number(rating),
        listingId,
        userId, // real logged‑in user id
      });

      const populated = await Review.findById(review._id)
        .populate("userId", "name email")
        .populate("listingId", "title location");

      return res.status(201).json(populated);
    } catch (error: any) {
      console.error("POST /api/reviews error:", error);
      return res.status(400).json({ error: error.message });
    }
  });

  // GET /api/reviews/:id
  app.get("/api/reviews/:id", async (req: Request, res: Response) => {
    try {
      const review = await Review.findById(req.params.id)
        .populate("userId", "name email")
        .populate("listingId", "title location");

      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }

      return res.json(review);
    } catch (error: any) {
      console.error("GET /api/reviews/:id error:", error);
      return res.status(500).json({ error: error.message });
    }
  });

  // PUT /api/reviews/:id  (UPDATE) – requires auth & ownership
  app.put("/api/reviews/:id", authMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId as string;
      const reviewId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        return res.status(400).json({ error: "Invalid review id" });
      }

      const existing = await Review.findOne({
        _id: reviewId,
        userId: new mongoose.Types.ObjectId(userId),
      });

      if (!existing) {
        return res.status(403).json({ error: "Not authorized to edit this review" });
      }

      const updated = await Review.findByIdAndUpdate(reviewId, req.body, {
        new: true,
        runValidators: true,
      })
        .populate("userId", "name email")
        .populate("listingId", "title location");

      if (!updated) {
        return res.status(404).json({ error: "Review not found" });
      }

      return res.json(updated);
    } catch (error: any) {
      console.error("PUT /api/reviews/:id error:", error);
      return res.status(400).json({ error: error.message });
    }
  });

  // PATCH /api/reviews/:id/status  (optional status field)
  app.patch("/api/reviews/:id/status", async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      const review = await Review.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      )
        .populate("userId", "name email")
        .populate("listingId", "title location");

      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }

      return res.json(review);
    } catch (error: any) {
      console.error("PATCH /api/reviews/:id/status error:", error);
      return res.status(400).json({ error: error.message });
    }
  });

  // DELETE /api/reviews/:id – requires auth & ownership
  app.delete(
    "/api/reviews/:id",
    authMiddleware,
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).userId as string;
        const reviewId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
          return res.status(400).json({ error: "Invalid review id" });
        }

        const existing = await Review.findOne({
          _id: reviewId,
          userId: new mongoose.Types.ObjectId(userId),
        });

        if (!existing) {
          return res
            .status(403)
            .json({ error: "Not authorized to delete this review" });
        }

        await Review.findByIdAndDelete(reviewId);
        return res.json({ message: "Review deleted successfully" });
      } catch (error: any) {
        console.error("DELETE /api/reviews/:id error:", error);
        return res.status(500).json({ error: error.message });
      }
    }
  );
};

// --------------------------------------------------
// MAIN ROUTE REGISTRATION
// --------------------------------------------------

export async function registerRoutes(app: Express): Promise<Server> {
  // AUTH ROUTES
  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });

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

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });

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

  // STAYS ROUTES
  app.get("/api/stays", async (_req: Request, res: Response) => {
    try {
      const stays = await Stay.find().populate("owner");
      return res.json(stays);
    } catch (err: any) {
      console.error("Get stays error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/stays", async (req: Request, res: Response) => {
    try {
      const stay = await Stay.create(req.body);
      return res.status(201).json(stay);
    } catch (err: any) {
      console.error("Create stay error:", err);
      return res.status(400).json({ message: err.message });
    }
  });

  // USERS ROUTES
  app.get("/api/users", async (_req: Request, res: Response) => {
    try {
      const users = await User.find();
      return res.json(users);
    } catch (err: any) {
      console.error("Get users error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const user = await User.create(req.body);
      return res.status(201).json(user);
    } catch (err: any) {
      console.error("Create user error:", err);
      return res.status(400).json({ message: err.message });
    }
  });

  // REVIEWS ROUTES
  setupReviewRoutes(app);

  // LISTINGS & BOOKINGS ROUTES
  app.use("/api/listings", listingsRouter);
  app.use("/api/bookings", bookingsRoutes);

  const httpServer = createServer(app);
  return httpServer;
}

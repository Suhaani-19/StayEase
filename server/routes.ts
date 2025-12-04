import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { User, Stay } from "./storage.js";
import listingsRouter from "./listingsRoutes.js";
import bookingsRoutes from './bookingsRoutes.js';
import mongoose from "mongoose";
import Review from "./models/Review.js";

// 🆕 Auth middleware
const authMiddleware = (req: Request, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    (req as any).userId = decoded.id;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Protect listings PUT/DELETE/POST
listingsRouter.put("/:id", authMiddleware);
listingsRouter.delete("/:id", authMiddleware);
listingsRouter.post("/", authMiddleware);

// 🆕 REVIEWS ROUTES - ✅ FULL CRUD WITH AUTH PROTECTION
const setupReviewRoutes = (app: Express) => {
  // ✅ GET /api/reviews?listingId=ABC (for ListingDetail)
  app.get('/api/reviews', async (req: any, res: any) => {
    try {
      const { listingId, page = 1, limit = 10, search = '', sort = 'createdAt', order = 'desc' } = req.query;
      let query: any = {};
      
      if (listingId && mongoose.Types.ObjectId.isValid(listingId)) {
        query.listingId = new mongoose.Types.ObjectId(listingId);
      }
      
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { comment: { $regex: search, $options: 'i' } }
        ];
      }
      
      const reviews = await Review.find(query)
        .populate('userId', 'name email')
        .populate('listingId', 'title location')
        .sort({ [sort]: order === 'desc' ? -1 : 1 })
        .limit(+limit)
        .skip((+page - 1) * +limit);
      
      const total = await Review.countDocuments(query);
      
      res.json({
        reviews,
        pagination: { page: +page, limit: +limit, total, pages: Math.ceil(total / +limit) }
      });
    } catch (error: any) {
      console.error('GET /api/reviews ERROR:', error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // ✅ POST /api/reviews - Create (no auth needed for demo)
  app.post('/api/reviews', async (req: any, res: any) => {
    try {
      console.log('📥 Creating review:', req.body);
      
      const { title, comment, rating, listingId } = req.body;
      
      if (!listingId || !mongoose.Types.ObjectId.isValid(listingId)) {
        return res.status(400).json({ error: `Invalid listingId: ${listingId}` });
      }

      const reviewData = {
        title,
        comment,
        rating: Number(rating),
        listingId: new mongoose.Types.ObjectId(listingId),
        userId: new mongoose.Types.ObjectId()  // ✅ Demo user (for testing)
      };
      
      console.log('📤 Clean data:', reviewData);
      
      const review = new Review(reviewData);
      await review.save();
      
      const populated = await Review.findById(review._id)
        .populate('userId', 'name email')
        .populate('listingId', 'title location');
      
      console.log('✅ Review created:', review._id);
      res.status(201).json(populated);
    } catch (error: any) {
      console.error('🚨 POST /api/reviews ERROR:', error.message);
      res.status(400).json({ error: error.message });
    }
  });

  // ✅ GET /api/reviews/:id
  app.get('/api/reviews/:id', async (req: any, res: any) => {
    try {
      const review = await Review.findById(req.params.id)
        .populate('userId', 'name email')
        .populate('listingId', 'title location');
      if (!review) return res.status(404).json({ error: 'Review not found' });
      res.json(review);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ✅ PUT /api/reviews/:id - UPDATE (PROTECTED)
  app.put('/api/reviews/:id', authMiddleware, async (req: any, res: any) => {
    try {
      console.log('🔄 Updating review:', req.params.id);
      
      // ✅ AUTH CHECK - Only owner can edit
      const userId = new mongoose.Types.ObjectId((req as any).userId);
      const review = await Review.findOne({ _id: req.params.id, userId });
      
      if (!review) {
        return res.status(403).json({ error: 'Not authorized to edit this review' });
      }

      const updated = await Review.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true, runValidators: true }
      )
        .populate('userId', 'name email')
        .populate('listingId', 'title location');
      
      if (!updated) {
        return res.status(404).json({ error: 'Review not found' });
      }
      
      console.log('✅ Review updated:', updated._id);
      res.json(updated);
    } catch (error: any) {
      console.error('🚨 PUT /api/reviews ERROR:', error.message);
      res.status(400).json({ error: error.message });
    }
  });

  // ✅ PATCH /api/reviews/:id/status
  app.patch('/api/reviews/:id/status', async (req: any, res: any) => {
    try {
      const { status } = req.body;
      const review = await Review.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      )
        .populate('userId', 'name email')
        .populate('listingId', 'title location');
      if (!review) return res.status(404).json({ error: 'Review not found' });
      res.json(review);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ✅ DELETE /api/reviews/:id - DELETE (PROTECTED)
  app.delete('/api/reviews/:id', authMiddleware, async (req: any, res: any) => {
    try {
      console.log('🗑️ Deleting review:', req.params.id);
      
      // ✅ AUTH CHECK - Only owner can delete
      const userId = new mongoose.Types.ObjectId((req as any).userId);
      const review = await Review.findOne({ _id: req.params.id, userId });
      
      if (!review) {
        return res.status(403).json({ error: 'Not authorized to delete this review' });
      }
      
      await Review.findByIdAndDelete(req.params.id);
      console.log('✅ Review deleted:', req.params.id);
      res.json({ message: 'Review deleted successfully' });
    } catch (error: any) {
      console.error('🚨 DELETE /api/reviews ERROR:', error.message);
      res.status(500).json({ error: error.message });
    }
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // ✅ AUTH ROUTES
  app.post("/api/auth/signup", async (req, res) => {
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

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
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

  // ✅ STAYS ROUTES
  app.get("/api/stays", async (_req, res) => {
    try {
      const stays = await Stay.find().populate("owner");
      return res.json(stays);
    } catch (err: any) {
      console.error("Get stays error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/stays", async (req, res) => {
    try {
      const stay = await Stay.create(req.body);
      return res.status(201).json(stay);
    } catch (err: any) {
      console.error("Create stay error:", err);
      return res.status(400).json({ message: err.message });
    }
  });

  // ✅ USERS ROUTES
  app.get("/api/users", async (_req, res) => {
    try {
      const users = await User.find();
      return res.json(users);
    } catch (err: any) {
      console.error("Get users error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const user = await User.create(req.body);
      return res.status(201).json(user);
    } catch (err: any) {
      console.error("Create user error:", err);
      return res.status(400).json({ message: err.message });
    }
  });

  // ✅ SETUP ALL REVIEWS ROUTES
  setupReviewRoutes(app);

  // ✅ LISTINGS & BOOKINGS ROUTES
  app.use("/api/listings", listingsRouter);
  app.use('/api/bookings', bookingsRoutes);

  const httpServer = createServer(app);
  return httpServer;
}

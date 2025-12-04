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

// Protect listings PUT/DELETE
listingsRouter.put("/:id", authMiddleware);
listingsRouter.delete("/:id", authMiddleware);
listingsRouter.post("/", authMiddleware);

// 🆕 REVIEW SCHEMA & MODEL
const ReviewSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
}, { timestamps: true });

let Review: any;

// 🆕 REVIEWS ROUTES (2C 2R 2U 2D) - ✅ FIXED ObjectId ISSUE
const setupReviewRoutes = (app: Express) => {
  Review = mongoose.model('Review', ReviewSchema, 'reviews');

  // ✅ FIXED READ 1: GET /api/reviews (SUPPORTS listingId FILTER)
  app.get('/api/reviews', async (req: any, res: any) => {
    try {
      const { listingId, page = 1, limit = 10, search = '', sort = 'createdAt', order = 'desc' } = req.query;
      let query: any = {};
      
      // ✅ SUPPORT listingId FILTER for ListingDetail
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

  // ✅ READ 2: GET /api/reviews/:id
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

  // ✅ FIXED CREATE 1: POST /api/reviews (ObjectId CONVERSION)
  app.post('/api/reviews', async (req: any, res: any) => {
    try {
      console.log('📥 Creating review:', req.body); // DEBUG
      
      const { title, comment, rating, userId, listingId } = req.body;
      const cleanBody: any = { title, comment, rating };
      
      // ✅ CONVERT STRING IDs TO ObjectId
      if (listingId && mongoose.Types.ObjectId.isValid(listingId)) {
        cleanBody.listingId = new mongoose.Types.ObjectId(listingId);
      } else {
        throw new Error(`Invalid listingId: ${listingId}`);
      }
      
      if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        cleanBody.userId = new mongoose.Types.ObjectId(userId);
      } else {
        // ✅ Generate test user for demo
        cleanBody.userId = new mongoose.Types.ObjectId();
        console.log('⚠️ Using generated test userId');
      }

      const review = new Review(cleanBody);
      await review.save();
      
      const populated = await Review.findById(review._id)
        .populate('userId', 'name email')
        .populate('listingId', 'title location');
      
      console.log('✅ Review created:', review._id); // DEBUG
      res.status(201).json(populated);
    } catch (error: any) {
      console.error('🚨 POST /api/reviews ERROR:', error.message);
      res.status(400).json({ error: error.message });
    }
  });

  // ✅ CREATE 2: POST /api/reviews/bulk
  app.post('/api/reviews/bulk', async (req: any, res: any) => {
    try {
      const reviews = await Review.insertMany(req.body);
      res.status(201).json(reviews);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ✅ UPDATE 1: PUT /api/reviews/:id
  app.put('/api/reviews/:id', async (req: any, res: any) => {
    try {
      const review = await Review.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true, runValidators: true }
      ).populate('userId', 'name email')
        .populate('listingId', 'title location');
      if (!review) return res.status(404).json({ error: 'Review not found' });
      res.json(review);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ✅ UPDATE 2: PATCH /api/reviews/:id/status
  app.patch('/api/reviews/:id/status', async (req: any, res: any) => {
    try {
      const { status } = req.body;
      const review = await Review.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      ).populate('userId', 'name email')
        .populate('listingId', 'title location');
      if (!review) return res.status(404).json({ error: 'Review not found' });
      res.json(review);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ✅ DELETE 1: DELETE /api/reviews/:id
  app.delete('/api/reviews/:id', async (req: any, res: any) => {
    try {
      const review = await Review.findByIdAndDelete(req.params.id);
      if (!review) return res.status(404).json({ error: 'Review not found' });
      res.json({ message: 'Review deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ✅ DELETE 2: DELETE /api/reviews/bulk
  app.delete('/api/reviews/bulk', async (req: any, res: any) => {
    try {
      const { ids } = req.body;
      const result = await Review.deleteMany({ _id: { $in: ids } });
      res.json({ message: `${result.deletedCount} reviews deleted` });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // AUTH ROUTES
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

  // STAYS ROUTES
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

  // USERS ROUTES
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

  // ✅ SETUP REVIEWS ROUTES
  setupReviewRoutes(app);

  // LISTINGS & BOOKINGS ROUTES
  app.use("/api/listings", listingsRouter);
  app.use('/api/bookings', bookingsRoutes);

  const httpServer = createServer(app);
  return httpServer;
}

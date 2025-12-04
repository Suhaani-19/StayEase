import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { User, Stay } from "./storage.js";
import listingsRouter from "./listingsRoutes.js";
import bookingsRoutes from './bookingsRoutes.js';

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


export async function registerRoutes(app: Express): Promise<Server> {
  // AUTH ROUTES (unchanged)
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

  // STAYS ROUTES (unchanged)
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

  // USERS ROUTES (unchanged)
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

  // LISTINGS & BOOKINGS ROUTES
  app.use("/api/listings", listingsRouter);
  app.use('/api/bookings', bookingsRoutes);

  const httpServer = createServer(app);
  return httpServer;
}

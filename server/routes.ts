// server/routes.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import type { Express } from "express";
import { createServer, type Server } from "http";
import { User, Stay } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // ------------------------------
  // ✅ AUTH ROUTES
  // ------------------------------

  // Signup route
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
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });

      res.status(201).json({
        message: "User created successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
        token,
      });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Login route
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });

      res.json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ------------------------------
  // EXISTING ROUTES (stays, users)
  // ------------------------------

  app.get("/api/stays", async (_req, res) => {
    const stays = await Stay.find().populate("owner");
    res.json(stays);
  });

  app.post("/api/stays", async (req, res) => {
    try {
      const stay = await Stay.create(req.body);
      res.status(201).json(stay);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.get("/api/users", async (_req, res) => {
    const users = await User.find();
    res.json(users);
  });

  app.post("/api/users", async (req, res) => {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  // ------------------------------
  const httpServer = createServer(app);
  return httpServer;
}

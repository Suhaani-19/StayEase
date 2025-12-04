import cors from "cors";
import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import path from "path";
import dotenv from "dotenv";

import { registerRoutes } from "./routes.js";
import { setupVite, log } from "./vite.js";
import { connectDB } from "./db.js";

dotenv.config();

const app = express();

// ✅ Allow only trusted origins (NO wildcard with credentials)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "https://stayease-1-mijo.onrender.com",
].filter(Boolean);

// Extend IncomingMessage to store raw body
declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// ✅ CORS MIDDLEWARE (FIXED & SAFE)
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Explicit preflight handler (THIS fixes your PUT 404)
app.options("*", cors());

// ✅ Body parser with raw body capture
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: false }));

// ✅ Request logger
app.use((req, res, next) => {
  const start = Date.now();
  const pathReq = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (pathReq.startsWith("/api")) {
      let logLine = `${req.method} ${pathReq} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse)
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      if (logLine.length > 80)
        logLine = logLine.slice(0, 79) + "…";
      log(logLine);
    }
  });

  next();
});

// 🎯 API ROUTES FIRST (before Vite/static)
(async () => {
  // ✅ Connect MongoDB first
  await connectDB();

  // ✅ Register API routes
  const server = await registerRoutes(app);

  // ✅ Global API error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // ✅ Frontend handling
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // ✅ Production: Serve React app
    const clientDistPath = path.resolve(process.cwd(), "client/dist");
    app.use(express.static(clientDistPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(clientDistPath, "index.html"));
    });
  }

  // ✅ Start server
  const port = parseInt(process.env.PORT || "5001", 10);
  server.listen(port, "0.0.0.0", () => {
    log(`🚀 Server running at http://localhost:${port}`);
  });
})();

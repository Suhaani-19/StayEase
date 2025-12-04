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

// Extend IncomingMessage to store raw body
declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// ✅ CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true,
  })
);

// ✅ Body parsers
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
      if (capturedJsonResponse) logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      if (logLine.length > 120) logLine = logLine.slice(0, 119) + "…";
      log(logLine);
    }
  });

  next();
});

(async () => {
  // ✅ Connect DB
  await connectDB();

  // ✅ REGISTER ALL API ROUTES FIRST
  const server = await registerRoutes(app);

  // ✅ API ERROR HANDLER
  app.use("/api", (err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  // ✅ FRONTEND HANDLING
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    const clientDistPath = path.resolve(process.cwd(), "client/dist");
    app.use(express.static(clientDistPath));

    // ✅ IMPORTANT: Only fallback when NOT /api
    app.get(/^\/(?!api).*/, (_req, res) => {
      res.sendFile(path.join(clientDistPath, "index.html"));
    });
  }

  // ✅ START SERVER
  const port = Number(process.env.PORT) || 5001;
  server.listen(port, "0.0.0.0", () => {
    log(`🚀 Server running at http://localhost:${port}`);
  });
})();

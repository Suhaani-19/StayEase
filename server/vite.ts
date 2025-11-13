import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import { nanoid } from "nanoid";
import { type Server } from "http";
import { ROOT, CLIENT_PATH, CLIENT_DIST, CLIENT_INDEX } from "./paths.js"; // include ROOT

export async function setupVite(app: Express, server: Server) {
  console.log("Vite dev mode. Using client root:", CLIENT_PATH);

  const vite = await createViteServer({
    root: CLIENT_PATH,
    server: { middlewareMode: true, hmr: { server }, allowedHosts: true },
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    try {
      const template = await fs.promises.readFile(path.join(CLIENT_PATH, "index.html"), "utf-8");
      const page = await vite.transformIndexHtml(
        req.originalUrl,
        template.replace(`src="/src/main.tsx"`, `src="/src/main.tsx?v=${nanoid()}"`)
      );
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (err) {
      vite.ssrFixStacktrace(err as Error);
      next(err);
    }
  });
}

export function serveStatic(app: Express) {
  if (!fs.existsSync(CLIENT_DIST)) {
    throw new Error(`Build not found at ${CLIENT_DIST}. Build client first!`);
  }

  console.log("Serving client from:", CLIENT_DIST);

  app.use(express.static(CLIENT_DIST));
  app.use("*", (_req, res) => {
    res.sendFile(CLIENT_INDEX);
  });
}

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

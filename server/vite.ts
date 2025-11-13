import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import { type Server } from "http";
import { nanoid } from "nanoid";

// Compute project root dynamically (server/dist → project root)
const projectRoot = path.resolve(__dirname, "../../");

export async function setupVite(app: Express, server: Server) {
  const clientPath = path.join(projectRoot, "client");
  const clientTemplate = path.join(clientPath, "index.html");

  console.log("Vite dev mode. Using client path:", clientPath);

  const vite = await createViteServer({
    root: clientPath,
    server: { middlewareMode: true, hmr: { server }, allowedHosts: true },
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    try {
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(req.originalUrl, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.join(projectRoot, "client/dist");

  if (!fs.existsSync(distPath)) {
    throw new Error(`Build not found at ${distPath}. Build client first!`);
  }

  console.log("Serving client from:", distPath);

  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
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

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "../shared"),
      "@assets": path.resolve(__dirname, "../attached_assets"),
    },
  },
  root: __dirname,
  server: {
    historyApiFallback: true,  // 👈 FIX #1: Dev server SPA support
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // 👈 FIX #2: Render.com SPA deployment
        manualChunks: undefined,
      },
    },
  },
  optimizeDeps: {
    include: ["axios"],
  },
  preview: {
    // 👈 FIX #3: Preview server SPA support
    port: 4173,
    open: true,
  },
});

import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Get path info
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Define paths
  const root = process.cwd();
  const distPath = path.resolve(root, "dist");
  
  // 2. Robust environment detection
  // If NODE_ENV is production OR the dist/index.html exists, we treat it as production
  const isProd = process.env.NODE_ENV === "production" || fs.existsSync(path.join(distPath, "index.html"));

  console.log(`Detected execution mode: ${isProd ? "PRODUCTION" : "DEVELOPMENT"}`);

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: isProd ? "production" : "development" });
  });

  if (!isProd) {
    // --- Development Mode ---
    console.log("Starting in DEVELOPMENT mode with Vite middleware...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // --- Production Mode ---
    console.log(`Starting in PRODUCTION mode. Serving from: ${distPath}`);
    
    // Serve static assets from build output
    app.use(express.static(distPath, { index: false }));

    // Fallback to built index.html for SPA routing
    // This ensures we serve the processed HTML, not the source one
    app.get("*", (req, res) => {
      const indexPath = path.resolve(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        console.error("CRITICAL: Production build missing index.html at", indexPath);
        res.status(500).send("Production build missing. Please run 'npm run build' first.");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

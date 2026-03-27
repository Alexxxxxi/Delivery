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
  const builtIndex = path.join(distPath, "index.html");
  
  // 2. ABSOLUTE PRODUCTION CHECK
  // If dist/index.html exists, we are in production. Period.
  const isProd = process.env.NODE_ENV === "production" || fs.existsSync(builtIndex);

  console.log(`[SERVER] Mode: ${isProd ? "PRODUCTION" : "DEVELOPMENT"}`);

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: isProd ? "production" : "development" });
  });

  if (!isProd) {
    // --- Development Mode ---
    console.log("[SERVER] Starting with Vite middleware...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // --- Production Mode ---
    console.log(`[SERVER] Serving from build output: ${distPath}`);
    
    // Serve static assets
    app.use(express.static(distPath, { index: false }));

    // Fallback to built index.html
    app.get("*", (req, res) => {
      if (fs.existsSync(builtIndex)) {
        res.sendFile(builtIndex);
      } else {
        console.error("[SERVER] CRITICAL ERROR: Build output missing!");
        res.status(500).send("Build output missing. Ensure 'npm run build' was executed.");
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

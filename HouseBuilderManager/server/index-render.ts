import path from "node:path";
import express from "express";
import { fileURLToPath } from "node:url";
import runApp from "./app";
import { registerRoutes } from "./routes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupProd(app, server) {
  // Serve static client files from dist
  const clientDist = path.resolve(__dirname, "..", "client", "dist");
  app.use(express.static(clientDist));

  // Send index.html for any unmatched route (for SPA)
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

(async () => {
  await runApp(setupProd);
})();
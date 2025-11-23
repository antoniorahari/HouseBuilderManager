#!/usr/bin/env node
// start-render.js: build client and start server in production
import { execSync } from "child_process";
import path from "path";
import fs from "fs";

const root = path.resolve(".");
const clientDir = path.join(root, "client");

// install client deps and build
if (fs.existsSync(clientDir)) {
  console.log("Building client...");
  execSync("npm --prefix client install --production --no-audit --no-fund", { stdio: "inherit" });
  execSync("npm --prefix client run build", { stdio: "inherit" });
}

console.log("Starting server...");
execSync("node --es-module-specifier-resolution=node server/index-render.js", { stdio: "inherit" });

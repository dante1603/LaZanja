const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const outputDir = path.join(root, ".vercel", "output");
const staticDir = path.join(outputDir, "static");

require("./build-static");

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(staticDir, { recursive: true });
fs.cpSync(distDir, staticDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, "config.json"), JSON.stringify({ version: 3 }, null, 2));

console.log("Vercel Build Output API artifact copied to .vercel/output/static");

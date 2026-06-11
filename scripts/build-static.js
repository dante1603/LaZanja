const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "dist");
const entries = ["index.html", "styles.css", "src", "assets"];

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

for (const entry of entries) {
  const source = path.join(root, entry);
  const target = path.join(outDir, entry);

  if (!fs.existsSync(source)) {
    throw new Error(`Missing required static entry: ${entry}`);
  }

  fs.cpSync(source, target, { recursive: true });
}

console.log(`Static prototype copied to ${path.relative(root, outDir)}`);

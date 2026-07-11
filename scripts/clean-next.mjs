import fs from "node:fs";
import path from "node:path";

const targets = [
  ".next",
  "tsconfig.tsbuildinfo",
];

for (const target of targets) {
  const resolved = path.resolve(process.cwd(), target);
  try {
    fs.rmSync(resolved, { recursive: true, force: true });
  } catch {
    // Ignore cleanup errors; next build will still continue.
  }
}

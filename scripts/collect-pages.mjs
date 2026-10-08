import { copyFileSync, cpSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const candidates = [".vercel/output/static", "dist/client", ".output/public"];
const src = candidates.find((dir) => existsSync(join(dir, "index.html")));
if (!src) {
  console.error("No prerendered index.html. Looked in:", candidates.join(", "));
  process.exit(1);
}
cpSync(src, "pages-dist", { recursive: true });
writeFileSync(join("pages-dist", ".nojekyll"), "");
copyFileSync(join("pages-dist", "index.html"), join("pages-dist", "404.html"));
console.log(`pages-dist ready from ${src}`);

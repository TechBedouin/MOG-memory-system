import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES = path.join(__dirname, "..", "templates");

export async function runInit(targetDir) {
  const root = path.resolve(targetDir);
  fs.mkdirSync(root, { recursive: true });

  const copies = [
    ["soul.md", "soul.md"],
    ["active_state.md", "active_state.md"],
    ["knowledge/MOG_RULES.md", "knowledge/MOG_RULES.md"],
    [".cursor/rules/mog.mdc", ".cursor/rules/mog.mdc"],
    [".github/workflows/mog-lint.yml", ".github/workflows/mog-lint.yml"],
  ];

  const specSrc = path.join(__dirname, "..", "spec", "MOG-1.0.md");
  const specDest = path.join(root, "spec", "MOG-1.0.md");
  if (fs.existsSync(specSrc) && !fs.existsSync(specDest)) {
    fs.mkdirSync(path.dirname(specDest), { recursive: true });
    fs.copyFileSync(specSrc, specDest);
    console.log("  created: spec/MOG-1.0.md");
  }

  for (const [src, dest] of copies) {
    const from = path.join(TEMPLATES, src);
    const to = path.join(root, dest);
    if (!fs.existsSync(from)) continue;
    if (fs.existsSync(to)) {
      console.log(`  skip (exists): ${dest}`);
      continue;
    }
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
    console.log(`  created: ${dest}`);
  }

  fs.mkdirSync(path.join(root, "knowledge"), { recursive: true });
  const gitkeep = path.join(root, "knowledge", ".gitkeep");
  if (!fs.existsSync(gitkeep)) fs.writeFileSync(gitkeep, "");

  console.log("\n✓ MOG initialized. Next steps:");
  console.log("  1. Edit soul.md with your project identity");
  console.log("  2. Add Cursor/Claude rule: always read soul + active_state on boot");
  console.log("  3. Run: mog lint");
}

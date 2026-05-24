import fs from "node:fs";
import path from "node:path";
import { parseEdges, readText, relPath, resolveTarget, walkMarkdown } from "./utils.js";

/**
 * Generates memory/GRAPH_INDEX.md with reverse edges (Referenced_By).
 * Does not mutate source files — safe for CI.
 */
export async function runWeave(root) {
  const backlinks = new Map();

  for (const file of walkMarkdown(root)) {
    const rel = relPath(root, file);
    for (const edge of parseEdges(readText(file))) {
      const target = resolveTarget(root, edge.target);
      if (!target) continue;
      if (!backlinks.has(target)) backlinks.set(target, []);
      backlinks.get(target).push({ from: rel, type: edge.type });
    }
  }

  const lines = [
    "# MOG Graph Index (auto-generated)",
    "",
    "> Run `mog weave` after changing edges. Do not edit by hand.",
    "",
  ];

  for (const [target, refs] of [...backlinks.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    lines.push(`## ${target}`);
    for (const r of refs) {
      lines.push(`- [Referenced_By]: ${r.from} _(via ${r.type})_`);
    }
    lines.push("");
  }

  const outDir = path.join(root, "memory");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "GRAPH_INDEX.md");
  fs.writeFileSync(outPath, lines.join("\n"), "utf8");
  console.log(`✓ Wove ${backlinks.size} nodes → ${relPath(root, outPath)}`);
}

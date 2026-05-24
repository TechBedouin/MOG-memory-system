import fs from "node:fs";
import path from "node:path";
import { parseEdges, parsePointers, readText, relPath, walkMarkdown, findRamFile } from "./utils.js";

function slug(id) {
  return id.replace(/[^a-zA-Z0-9_]/g, "_");
}

export async function runGraph(root, { out } = {}) {
  const nodes = new Set();
  const edges = [];

  const ram = findRamFile(root);
  if (ram) {
    const ramRel = relPath(root, ram);
    nodes.add(ramRel);
    for (const p of parsePointers(readText(ram))) {
      nodes.add(p.path);
      nodes.add(ramRel);
      edges.push({ from: ramRel, to: p.path.replace(/\\/g, "/"), label: "pointer" });
    }
  }

  for (const file of walkMarkdown(root)) {
    const rel = relPath(root, file);
    nodes.add(rel);
    for (const edge of parseEdges(readText(file))) {
      const target = edge.target.replace(/\\/g, "/");
      nodes.add(target);
      edges.push({ from: rel, to: target, label: edge.type });
    }
  }

  const lines = ["flowchart LR"];
  const nodeIds = new Map();
  for (const n of nodes) {
    const id = slug(n);
    nodeIds.set(n, id);
    const label = n.replace(/"/g, "'");
    lines.push(`  ${id}["${label}"]`);
  }

  for (const e of edges) {
    const from = nodeIds.get(e.from) || slug(e.from);
    const to = nodeIds.get(e.to) || slug(e.to);
    lines.push(`  ${from} -->|${e.label}| ${to}`);
  }

  const mermaid = lines.join("\n") + "\n";
  const outPath = out ? path.resolve(out) : path.join(root, "GRAPH.mmd");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, mermaid, "utf8");
  console.log(`✓ Graph written to ${path.relative(process.cwd(), outPath) || outPath}`);
  console.log(`  ${nodes.size} nodes, ${edges.length} edges`);
}

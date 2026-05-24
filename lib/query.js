import { parseEdges, readText, relPath, walkMarkdown } from "./utils.js";

export async function runQuery(pattern, root, { json = false } = {}) {
  const [edgeType, glob] = pattern.includes(":")
    ? pattern.split(":", 2)
    : ["relates_to", pattern];

  const normalizedType = edgeType
    .replace(/-/g, "_")
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("_");

  const typeMap = {
    Relates_To: "Relates_To",
    Relates_to: "Relates_To",
    Blocked_By: "Blocked_By",
    Resolves: "Resolves",
    Prerequisite_For: "Prerequisite_For",
    Referenced_By: "Referenced_By",
  };

  const wantType = typeMap[normalizedType] || normalizedType;
  const wantGlob = glob === "*" ? null : glob?.toLowerCase();

  const results = [];

  for (const file of walkMarkdown(root)) {
    const rel = relPath(root, file);
    for (const edge of parseEdges(readText(file))) {
      if (edge.type !== wantType) continue;
      if (wantGlob && !edge.target.toLowerCase().includes(wantGlob)) continue;
      results.push({ file: rel, type: edge.type, target: edge.target });
    }
  }

  if (json) {
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  if (results.length === 0) {
    console.log(`No matches for: ${pattern}`);
    return;
  }

  for (const r of results) {
    console.log(`${r.file}\n  [${r.type}]: ${r.target}`);
  }
  console.log(`\n${results.length} match(es)`);
}

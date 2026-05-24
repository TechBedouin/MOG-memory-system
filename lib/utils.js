import fs from "node:fs";
import path from "node:path";

export const EDGE_TYPES = [
  "Relates_To",
  "Blocked_By",
  "Resolves",
  "Prerequisite_For",
  "Referenced_By",
];

const EDGE_RE = new RegExp(
  `^\\[(${EDGE_TYPES.join("|")})\\]:\\s*(.+?)\\s*$`,
  "im"
);

const POINTER_RE =
  /-\s*\*\*\[([^\]]+\.md)\]\*\*\s*:\s*TL;DR\s*->\s*(.+)/gi;

const RAM_THREAD_RE = /-\s*\*\*Active Thread:\*\*\s*(.+)/i;
const RAM_NEXT_RE = /-\s*\*\*Immediate Next Step:\*\*\s*(.+)/i;
const RAM_BLOCKED_RE = /-\s*\*\*\[Blocked_By\]:\*\*\s*(.+)/i;

export function walkMarkdown(root, ignore = new Set(["node_modules", ".git", "dist"])) {
  const files = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (ignore.has(ent.name)) continue;
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(full);
      else if (ent.name.endsWith(".md")) files.push(full);
    }
  }
  walk(path.resolve(root));
  return files;
}

export function relPath(root, file) {
  return path.relative(root, file).split(path.sep).join("/");
}

export function readText(file) {
  return fs.readFileSync(file, "utf8");
}

export function parseEdges(content) {
  const edges = [];
  for (const line of content.split("\n")) {
    const m = line.match(EDGE_RE);
    if (m) edges.push({ type: m[1], target: m[2].trim() });
  }
  return edges;
}

export function parsePointers(content) {
  const pointers = [];
  let m;
  const re = new RegExp(POINTER_RE.source, "gi");
  while ((m = re.exec(content)) !== null) {
    pointers.push({ path: m[1].trim(), tldr: m[2].trim() });
  }
  return pointers;
}

export function parseRamFields(content) {
  return {
    activeThread: content.match(RAM_THREAD_RE)?.[1]?.trim(),
    nextStep: content.match(RAM_NEXT_RE)?.[1]?.trim(),
    blockedBy: content.match(RAM_BLOCKED_RE)?.[1]?.trim(),
  };
}

export function resolveTarget(root, target) {
  const normalized = target.replace(/\\/g, "/");
  const candidates = [
    path.join(root, normalized),
    path.join(root, normalized.endsWith(".md") ? normalized : `${normalized}.md`),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return relPath(root, c);
  }
  return null;
}

export function findRamFile(root) {
  const direct = path.join(root, "active_state.md");
  if (fs.existsSync(direct)) return direct;
  const memory = path.join(root, "memory", "active_state.md");
  if (fs.existsSync(memory)) return memory;
  return null;
}

export function findSoulFile(root) {
  const direct = path.join(root, "soul.md");
  if (fs.existsSync(direct)) return direct;
  const memory = path.join(root, "memory", "soul.md");
  if (fs.existsSync(memory)) return memory;
  return null;
}

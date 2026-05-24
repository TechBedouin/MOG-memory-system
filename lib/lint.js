import fs from "node:fs";
import path from "node:path";
import {
  findRamFile,
  findSoulFile,
  parseEdges,
  parsePointers,
  parseRamFields,
  readText,
  relPath,
  resolveTarget,
  walkMarkdown,
} from "./utils.js";

export async function runLint(root, { json = false } = {}) {
  const issues = [];

  const soul = findSoulFile(root);
  if (!soul) {
    issues.push({ level: "error", code: "MOG001", message: "Missing soul.md" });
  }

  const ram = findRamFile(root);
  if (!ram) {
    issues.push({ level: "error", code: "MOG002", message: "Missing active_state.md" });
  } else {
    const content = readText(ram);
    const ramRel = relPath(root, ram);
    const fields = parseRamFields(content);

    if (!fields.activeThread) {
      issues.push({
        level: "warn",
        code: "MOG010",
        file: ramRel,
        message: "Missing **Active Thread:** in RAM",
      });
    }
    if (!fields.nextStep) {
      issues.push({
        level: "warn",
        code: "MOG011",
        file: ramRel,
        message: "Missing **Immediate Next Step:** in RAM",
      });
    }

    const pointers = parsePointers(content);
    if (pointers.length === 0) {
      issues.push({
        level: "info",
        code: "MOG012",
        file: ramRel,
        message: "No semantic pointers in RAM yet",
      });
    }

    for (const p of pointers) {
      if (!p.tldr || p.tldr.length < 8) {
        issues.push({
          level: "error",
          code: "MOG020",
          file: ramRel,
          message: `Pointer TL;DR too short: [${p.path}]`,
        });
      }
      const resolved = resolveTarget(root, p.path);
      if (!resolved) {
        issues.push({
          level: "error",
          code: "MOG021",
          file: ramRel,
          message: `Broken pointer: [${p.path}]`,
        });
      }
    }

    const badPointers = content.match(/-\s*\*\*\[[^\]]+\.md\]\*\*(?!\s*:\s*TL;DR)/gi);
    if (badPointers) {
      for (const _ of badPointers) {
        issues.push({
          level: "error",
          code: "MOG022",
          file: ramRel,
          message: "Pointer missing ': TL;DR ->' suffix",
        });
        break;
      }
    }
  }

  const mdFiles = walkMarkdown(root);
  const inbound = new Map();

  for (const file of mdFiles) {
    const rel = relPath(root, file);
    const content = readText(file);
    const edges = parseEdges(content);

    for (const edge of edges) {
      const resolved = resolveTarget(root, edge.target);
      if (!resolved) {
        issues.push({
          level: "error",
          code: "MOG030",
          file: rel,
          message: `Broken edge [${edge.type}]: ${edge.target}`,
        });
      } else {
        if (!inbound.has(resolved)) inbound.set(resolved, []);
        inbound.get(resolved).push({ from: rel, type: edge.type });
      }
    }
  }

  if (ram) {
    const ramRel = relPath(root, ram);
    for (const p of parsePointers(readText(ram))) {
      const resolved = resolveTarget(root, p.path);
      if (resolved) {
        if (!inbound.has(resolved)) inbound.set(resolved, []);
        inbound.get(resolved).push({ from: ramRel, type: "Pointer" });
      }
    }
  }

  const knowledgeDir = path.join(root, "knowledge");
  if (fs.existsSync(knowledgeDir)) {
    for (const file of walkMarkdown(knowledgeDir)) {
      const rel = relPath(root, file);
      if (rel.endsWith("MOG_RULES.md")) continue;
      if (!inbound.has(rel)) {
        issues.push({
          level: "info",
          code: "MOG040",
          file: rel,
          message: "Orphan knowledge node (no inbound pointer or edge)",
        });
      }
    }
  }

  if (json) {
    console.log(JSON.stringify({ ok: !issues.some((i) => i.level === "error"), issues }, null, 2));
  } else {
    const errors = issues.filter((i) => i.level === "error");
    const warns = issues.filter((i) => i.level === "warn");
    const infos = issues.filter((i) => i.level === "info");

    if (issues.length === 0) {
      console.log("✓ MOG lint passed — memory graph is healthy.");
    } else {
      for (const i of errors) console.log(`✗ [${i.code}] ${i.file ? i.file + ": " : ""}${i.message}`);
      for (const i of warns) console.log(`⚠ [${i.code}] ${i.file ? i.file + ": " : ""}${i.message}`);
      for (const i of infos) console.log(`ℹ [${i.code}] ${i.file ? i.file + ": " : ""}${i.message}`);
      console.log(`\n${errors.length} error(s), ${warns.length} warning(s), ${infos.length} info`);
    }
  }

  return issues.some((i) => i.level === "error") ? 1 : 0;
}

#!/usr/bin/env node
import { runInit } from "../lib/init.js";
import { runLint } from "../lib/lint.js";
import { runGraph } from "../lib/graph.js";
import { runQuery } from "../lib/query.js";
import { runWeave } from "../lib/weave.js";

const VERSION = "1.0.0";

const HELP = `
mog-memory v${VERSION} — Markdown Object Graph for coding agents

Usage:
  mog init [directory]          Scaffold MOG memory in a project
  mog lint [directory]          Validate pointers, edges, and RAM structure
  mog graph [directory]         Emit Mermaid graph (GRAPH.mmd)
  mog weave [directory]         Generate memory/GRAPH_INDEX.md (backlinks)
  mog query <pattern> [dir]     Query graph edges (e.g. relates_to:*)

Examples:
  npx mog init .
  mog lint
  mog graph --out docs/graph.mmd
  mog query "blocked_by:*"
`;

function parseArgs(argv) {
  const args = [...argv];
  const flags = {};
  const positional = [];

  while (args.length) {
    const a = args[0];
    if (a === "--help" || a === "-h") {
      flags.help = true;
      args.shift();
    } else if (a === "--out" || a === "-o") {
      flags.out = args[1];
      args.splice(0, 2);
    } else if (a === "--json") {
      flags.json = true;
      args.shift();
    } else if (a.startsWith("-")) {
      console.error(`Unknown flag: ${a}`);
      process.exit(1);
    } else {
      positional.push(args.shift());
    }
  }

  return { flags, positional };
}

async function main() {
  const { flags, positional } = parseArgs(process.argv.slice(2));

  if (flags.help || positional.length === 0) {
    console.log(HELP.trim());
    process.exit(0);
  }

  const cmd = positional[0];
  const target = positional[1] || process.cwd();

  try {
    switch (cmd) {
      case "init":
        await runInit(target);
        break;
      case "lint": {
        const code = await runLint(positional[1] || process.cwd(), { json: flags.json });
        process.exit(code);
      }
      case "graph":
        await runGraph(positional[1] || process.cwd(), { out: flags.out });
        break;
      case "weave":
        await runWeave(positional[1] || process.cwd());
        break;
      case "query": {
        const pattern = positional[1];
        const dir = positional[2] || process.cwd();
        if (!pattern) {
          console.error("Usage: mog query <pattern> [directory]");
          console.error('Example: mog query "relates_to:*"');
          process.exit(1);
        }
        await runQuery(pattern, dir, { json: flags.json });
        break;
      }
      case "version":
      case "-v":
      case "--version":
        console.log(VERSION);
        break;
      default:
        console.error(`Unknown command: ${cmd}\n`);
        console.log(HELP.trim());
        process.exit(1);
    }
  } catch (err) {
    console.error(`mog: ${err.message}`);
    process.exit(1);
  }
}

main();

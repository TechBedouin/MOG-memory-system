import { test } from "node:test";
import assert from "node:assert";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runLint } from "../lib/lint.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const example = path.join(__dirname, "..", "examples", "three-session-bugfix");

test("example passes mog lint", async () => {
  const code = await runLint(example, { json: false });
  assert.strictEqual(code, 0);
});

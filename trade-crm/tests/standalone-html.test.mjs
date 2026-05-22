import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("standalone CRM html exists as a self-contained local page", async () => {
  const html = await readFile(new URL("../standalone.html", import.meta.url), "utf8");

  assert.match(html, /<title>TradePilot CRM 本地版<\/title>/);
  assert.match(html, /<style>/);
  assert.match(html, /<script>/);
  assert.doesNotMatch(html, /src="\.\//);
  assert.doesNotMatch(html, /href="\.\//);
  assert.match(html, /localStorage/);

  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((match) => match[1]);
  assert.ok(scripts.length > 0);

  for (const script of scripts) {
    assert.doesNotThrow(() => new Function(script));
  }
});

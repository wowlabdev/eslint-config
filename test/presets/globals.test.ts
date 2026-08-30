import { describe, expect, it } from "vitest";

import { presets } from "../../src/index.js";
import { eslintFor, lintFixture, ruleIds } from "../support/eslint.js";

describe("runtime presets", () => {
  it("provides Deno and Node globals", async () => {
    const eslint = eslintFor({ presets: [presets.deno(), presets.node()] });
    const deno = await lintFixture(eslint, "deno.tsx");
    const node = await lintFixture(eslint, "node.cjs");

    expect(ruleIds(deno)).not.toContain("no-undef");
    expect(ruleIds(node)).not.toContain("no-undef");
  });
});

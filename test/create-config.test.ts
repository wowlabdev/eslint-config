import { describe, expect, it } from "vitest";

import { presets } from "../src/index.js";
import { eslintFor, lintFixture, ruleIds } from "./support/eslint.js";
import { fixture } from "./support/fixtures.js";

describe("createConfig", () => {
  it("uses consumer import patterns", async () => {
    const eslint = eslintFor({ internalPatterns: ["^@acme/"] });
    const result = await lintFixture(eslint, "import-order.js", "src/app.js");

    expect(ruleIds(result)).toContain("perfectionist/sort-imports");
  });

  it("applies file overrides after consumer rules", async () => {
    const eslint = eslintFor({
      overrides: [{ files: ["test/**"], rules: { "no-console": "off" } }],
      rules: { "no-console": "error" },
    });
    const source = await lintFixture(eslint, "console.js", "src/app.js");
    const test = await lintFixture(eslint, "console.js", "test/app.test.js");

    expect(ruleIds(source)).toContain("no-console");
    expect(ruleIds(test)).not.toContain("no-console");
  });

  it("applies global ignores", async () => {
    const eslint = eslintFor({ ignores: ["dist/**"] });

    await expect(eslint.isPathIgnored("dist/output.js")).resolves.toBe(true);
    await expect(eslint.isPathIgnored("src/index.js")).resolves.toBe(false);
  });

  it("separates function implementations without splitting overloads", async () => {
    const options = {
      presets: [presets.typescript()],
      rules: { "perfectionist/sort-modules": "off" as const },
    };
    const result = await lintFixture(
      eslintFor(options),
      "function-spacing.ts.txt",
      "function-spacing.ts",
    );
    const fixed = await lintFixture(
      eslintFor(options, true),
      "function-spacing.ts.txt",
      "function-spacing.ts",
    );
    const messages = result.messages.filter(
      ({ ruleId }) => ruleId === "wowlab/function-padding",
    );
    const layoutMessages = result.messages.filter(({ ruleId }) =>
      [
        "@stylistic/padding-line-between-statements",
        "wowlab/function-padding",
      ].includes(ruleId ?? ""),
    );

    expect(messages).toHaveLength(6);
    expect(layoutMessages).toHaveLength(6);
    expect(fixed.output).toBe(await fixture("function-spacing.fixed.txt"));
  });
});

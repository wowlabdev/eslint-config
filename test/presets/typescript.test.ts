import { describe, expect, it } from "vitest";

import { presets } from "../../src/index.js";
import { eslintFor, lintFixture, wasConfigured } from "../support/eslint.js";

describe("TypeScript preset", () => {
  it("scopes its parser and rules", async () => {
    const eslint = eslintFor({
      presets: [presets.typescript({ files: ["typed/**/*.ts"] })],
    });
    const typed = await lintFixture(
      eslint,
      "typed-value.ts",
      "typed/example.ts",
    );
    const outside = await lintFixture(
      eslint,
      "typed-value.ts",
      "outside/example.ts",
    );

    expect(typed.fatalErrorCount).toBe(0);
    expect(wasConfigured(outside)).toBe(false);
  });
});

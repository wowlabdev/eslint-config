import { describe, expect, it } from "vitest";

import { presets } from "../../src/index.js";
import {
  eslintFor,
  lintFixture,
  ruleIds,
  wasConfigured,
} from "../support/eslint.js";
import { fixturePath } from "../support/fixtures.js";

describe("React preset", () => {
  it("enables JavaScript without enabling TypeScript", async () => {
    const eslint = eslintFor({ presets: [presets.react()] });
    const jsx = await lintFixture(eslint, "react-list.jsx", "component.jsx");
    const tsx = await lintFixture(eslint, "component.tsx", "component.tsx");

    expect(ruleIds(jsx)).toContain("@eslint-react/no-array-index-key");
    expect(wasConfigured(tsx)).toBe(false);
  });

  it("scopes JavaScript files", async () => {
    const eslint = eslintFor({
      presets: [presets.react({ files: ["ui/**/*.jsx"] })],
    });
    const included = await lintFixture(eslint, "react-list.jsx", "ui/list.jsx");
    const outside = await lintFixture(
      eslint,
      "react-list.jsx",
      "outside/list.jsx",
    );

    expect(ruleIds(included)).toContain("@eslint-react/no-array-index-key");
    expect(ruleIds(outside)).not.toContain("@eslint-react/no-array-index-key");
  });

  it("scopes TypeScript files", async () => {
    const eslint = eslintFor({
      presets: [
        presets.react({
          typescript: true,
          typescriptFiles: ["ui/**/*.tsx"],
        }),
      ],
    });
    const included = await lintFixture(
      eslint,
      "component.tsx",
      "ui/component.tsx",
    );
    const outside = await lintFixture(
      eslint,
      "component.tsx",
      "outside/component.tsx",
    );

    expect(included.fatalErrorCount).toBe(0);
    expect(wasConfigured(outside)).toBe(false);
  });

  it("runs type-aware rules", async () => {
    const root = fixturePath("");
    const eslint = eslintFor({
      presets: [presets.react({ tsconfigRootDir: root, typeChecked: true })],
    });
    const result = await lintFixture(
      eslint,
      "leaked-render.tsx",
      fixturePath("leaked-render.tsx"),
    );

    expect(ruleIds(result)).toContain(
      "@eslint-react/no-leaked-conditional-rendering",
    );
  });
});

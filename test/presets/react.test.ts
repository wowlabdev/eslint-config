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

  it("enables React Hooks rules", async () => {
    const eslint = eslintFor({ presets: [presets.react()] });
    const result = await lintFixture(eslint, "hook-dependency.jsx");

    expect(ruleIds(result)).toContain("react-hooks/exhaustive-deps");
  });

  it("scopes React Hooks rules", async () => {
    const eslint = eslintFor({
      presets: [presets.react({ files: ["ui/**/*.jsx"] })],
    });
    const included = await lintFixture(
      eslint,
      "hook-dependency.jsx",
      "ui/component.jsx",
    );
    const outside = await lintFixture(
      eslint,
      "hook-dependency.jsx",
      "outside/component.jsx",
    );

    expect(ruleIds(included)).toContain("react-hooks/exhaustive-deps");
    expect(ruleIds(outside)).not.toContain("react-hooks/exhaustive-deps");
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

  it("enables React Hooks rules for TypeScript", async () => {
    const eslint = eslintFor({
      presets: [presets.react({ typescript: true })],
    });
    const result = await lintFixture(
      eslint,
      "hook-dependency.jsx",
      "component.tsx",
    );

    expect(ruleIds(result)).toContain("react-hooks/exhaustive-deps");
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

  it("can run type-aware React rules without type-aware TypeScript rules", async () => {
    const root = fixturePath("");
    const eslint = eslintFor({
      presets: [
        presets.react({
          tsconfigRootDir: root,
          typeChecked: true,
          typescriptTypeChecked: false,
        }),
      ],
    });
    const config = await eslint.calculateConfigForFile(
      fixturePath("leaked-render.tsx"),
    );

    expect(
      config?.rules["@eslint-react/no-leaked-conditional-rendering"],
    ).toBeDefined();
    expect(
      config?.rules["@typescript-eslint/no-floating-promises"],
    ).toBeUndefined();
  });
});

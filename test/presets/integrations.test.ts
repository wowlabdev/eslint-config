import { describe, expect, it } from "vitest";

import { presets } from "../../src/index.js";
import { eslintFor, lintFixture, ruleIds } from "../support/eslint.js";

describe("framework presets", () => {
  it("applies Next.js rules", async () => {
    const eslint = eslintFor({ presets: [presets.react(), presets.next()] });
    const result = await lintFixture(eslint, "next-image.jsx");

    expect(ruleIds(result)).toContain("@next/next/no-img-element");
  });

  it("scopes TanStack Query rules", async () => {
    const eslint = eslintFor({
      presets: [presets.tanstackQuery({ files: ["queries/**/*.js"] })],
    });
    const included = await lintFixture(
      eslint,
      "query-client.js",
      "queries/component.js",
    );
    const outside = await lintFixture(
      eslint,
      "query-client.js",
      "outside/component.js",
    );

    expect(ruleIds(included)).toContain("@tanstack/query/stable-query-client");
    expect(ruleIds(outside)).not.toContain(
      "@tanstack/query/stable-query-client",
    );
  });
});

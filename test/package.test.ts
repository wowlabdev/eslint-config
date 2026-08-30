import { ESLint } from "eslint";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";
import ts from "typescript";
import { describe, expect, it } from "vitest";

import { preparePackage } from "../scripts/package.js";
import { fixture } from "./support/fixtures.js";

const execFileAsync = promisify(execFile);

describe("published package", () => {
  it("contains only runtime files", async () => {
    const output = await preparePackage();
    const { stdout } = await execFileAsync(
      "npm",
      ["pack", output, "--dry-run", "--json"],
      { encoding: "utf8", shell: process.platform === "win32" },
    );
    const [pack] = JSON.parse(stdout) as [{ files: { path: string }[] }];
    const files = pack.files.map(({ path }) => path).sort();

    const modules = [
      "dist/core/base",
      "dist/core/perfectionist",
      "dist/core/stylistic",
      "dist/create-config",
      "dist/index",
      "dist/presets/globals",
      "dist/presets/next",
      "dist/presets/react",
      "dist/presets/tanstack-query",
      "dist/presets/typescript",
    ];
    const expectedFiles = [
      "LICENSE",
      "README.md",
      ...modules.flatMap((module) => [`${module}.d.ts`, `${module}.js`]),
      "package.json",
    ].sort();

    expect(files).toEqual(expectedFiles);

    const packageJson = JSON.parse(
      await readFile(`${output}/package.json`, "utf8"),
    ) as Record<string, unknown>;

    expect(packageJson.name).toBe("@wowlab/eslint-config");
    expect(packageJson.version).toBe("0.1.0");
    expect(packageJson.devDependencies).toBeUndefined();
    expect(packageJson.scripts).toBeUndefined();
  });

  it("loads its public export and ships valid declarations", async () => {
    const output = await preparePackage();
    const packageJson = JSON.parse(
      await readFile(join(output, "package.json"), "utf8"),
    ) as {
      exports: { ".": { import: string; types: string } };
    };
    const publicExport = packageJson.exports["."];
    const runtimePath = resolve(output, publicExport.import);
    const declarationsPath = resolve(output, publicExport.types);
    const runtimeUrl = pathToFileURL(runtimePath).href;
    const module: typeof import("../src/index.js") = await import(runtimeUrl);
    const eslint = new ESLint({
      overrideConfig: module.createConfig({
        presets: [module.presets.react({ typescript: true })],
      }),
      overrideConfigFile: true,
    });
    const [result] = await eslint.lintText(await fixture("component.tsx"), {
      filePath: "component.tsx",
    });

    expect(result?.fatalErrorCount).toBe(0);

    const consumer = await mkdtemp(join(tmpdir(), "eslint-config-consumer-"));

    try {
      const consumerPath = join(consumer, "consumer.ts");

      await writeFile(consumerPath, await fixture("consumer.ts.txt"));

      const program = ts.createProgram([consumerPath], {
        module: ts.ModuleKind.NodeNext,
        moduleResolution: ts.ModuleResolutionKind.NodeNext,
        noEmit: true,
        paths: {
          "@wowlab/eslint-config": [declarationsPath],
        },
        strict: true,
        target: ts.ScriptTarget.ES2022,
      });
      const diagnostics = ts.getPreEmitDiagnostics(program);

      expect(
        diagnostics.map(({ code, messageText }) => ({ code, messageText })),
      ).toEqual([]);
    } finally {
      await rm(consumer, { force: true, recursive: true });
    }
  }, 15_000);
});

import { ESLint } from "eslint";

import { type ConfigOptions, createConfig } from "../../src/index.js";
import { fixture } from "./fixtures.js";

export function eslintFor(options?: ConfigOptions): ESLint {
  return new ESLint({
    overrideConfig: createConfig(options),
    overrideConfigFile: true,
  });
}

export async function lintFixture(
  eslint: ESLint,
  name: string,
  filePath = name,
): Promise<ESLint.LintResult> {
  const [result] = await eslint.lintText(await fixture(name), { filePath });

  if (!result) {
    throw new Error(`ESLint returned no result for ${filePath}`);
  }

  return result;
}

export function ruleIds(result: ESLint.LintResult): string[] {
  return result.messages.flatMap(({ ruleId }) => (ruleId ? [ruleId] : []));
}

export function wasConfigured(result: ESLint.LintResult): boolean {
  return result.messages.every(
    ({ message }) => !message.includes("no matching configuration"),
  );
}

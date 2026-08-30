import type { Config, ConfigWithExtendsArray } from "@eslint/config-helpers";
import type { Linter } from "eslint";

import { defineConfig, globalIgnores } from "eslint/config";

import { createBaseConfig } from "./core/base.js";

export interface ConfigOptions {
  ignores?: string[];
  internalPatterns?: string[];
  overrides?: ConfigInput[];
  presets?: ConfigInput[];
  rules?: Partial<Linter.RulesRecord>;
}

type ConfigInput = ConfigWithExtendsArray[number];

export function createConfig({
  ignores = [],
  internalPatterns = [],
  overrides = [],
  presets = [],
  rules = {},
}: ConfigOptions = {}): Config[] {
  const config: ConfigWithExtendsArray = [
    ...createBaseConfig({ internalPatterns }),
    ...presets,
  ];

  if (ignores.length > 0) {
    config.push(globalIgnores(ignores, "wowlab/global-ignores"));
  }

  if (Object.keys(rules).length > 0) {
    config.push({ name: "wowlab/consumer-rules", rules });
  }

  config.push(...overrides);

  return defineConfig(...config);
}

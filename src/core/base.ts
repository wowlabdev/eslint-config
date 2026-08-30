import type { Linter } from "eslint";

import comments from "@eslint-community/eslint-plugin-eslint-comments/configs";
import js from "@eslint/js";
import sonarjs from "eslint-plugin-sonarjs";
import switchCase from "eslint-plugin-switch-case";
import unicorn from "eslint-plugin-unicorn";

import { perfectionistConfig } from "./perfectionist.js";
import { wowlabPlugin } from "./plugin.js";
import { stylisticConfig } from "./stylistic.js";

const ruleOverrides: Linter.RulesRecord = {
  "@eslint-community/eslint-comments/disable-enable-pair": [
    "error",
    { allowWholeFile: true },
  ],
  "@eslint-community/eslint-comments/no-unlimited-disable": "off",
  "sonarjs/pseudo-random": "off",
  "sonarjs/todo-tag": "off",
  "sonarjs/void-use": "off",
  "unicorn/import-style": "off",
  "unicorn/no-abusive-eslint-disable": "off",
  "unicorn/no-array-reduce": "off",
  "unicorn/no-array-sort": "off",
  "unicorn/no-await-expression-member": "off",
  "unicorn/no-null": "off",
  "unicorn/no-thenable": "off",
  "unicorn/number-literal-case": "off",
  "unicorn/prefer-global-this": "off",
  "unicorn/prefer-spread": "off",
  "unicorn/prevent-abbreviations": "off",
};

export function createBaseConfig({
  internalPatterns = [],
}: {
  internalPatterns?: string[];
} = {}): Linter.Config[] {
  return [
    {
      linterOptions: { reportUnusedDisableDirectives: "error" },
      name: "wowlab/linter-options",
    },
    {
      ...js.configs.recommended,
      name: "wowlab/javascript",
    },
    perfectionistConfig(internalPatterns),
    {
      name: "wowlab/layout",
      plugins: { wowlab: wowlabPlugin },
      rules: { "wowlab/function-padding": "error" },
    },
    stylisticConfig,
    {
      name: "wowlab/switch-case",
      plugins: { "switch-case": switchCase },
      rules: {
        "switch-case/newline-between-switch-case": [
          "error",
          "always",
          { fallthrough: "never" },
        ],
      },
    },
    unicorn.configs["flat/recommended"],
    sonarjs.configs.recommended,
    comments.recommended,
    { name: "wowlab/rule-defaults", rules: ruleOverrides },
  ];
}

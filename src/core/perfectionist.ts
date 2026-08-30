import type { Linter } from "eslint";

import perfectionist from "eslint-plugin-perfectionist";

// prettier-ignore
const CLASS_GROUPS = [
  "index-signature",
  ["static-property", "static-accessor-property"],
  "static-block",
  "static-get-method",
  "static-set-method",
  "static-method",
  ["property", "accessor-property"],
  ["protected-property", "protected-accessor-property"],
  ["private-property", "private-accessor-property"],
  "constructor",
  "get-method",
  "set-method",
  "method",
  "protected-get-method",
  "protected-set-method",
  "protected-method",
  "private-get-method",
  "private-set-method",
  "private-method",
  "unknown",
];

export function perfectionistConfig(internalPatterns: string[]): Linter.Config {
  const importOptions =
    internalPatterns.length > 0 ? { internalPattern: internalPatterns } : {};

  return {
    name: "wowlab/perfectionist",
    plugins: { perfectionist },
    rules: {
      curly: ["error", "all"],
      "perfectionist/sort-array-includes": "warn",
      "perfectionist/sort-classes": ["warn", { groups: CLASS_GROUPS }],
      "perfectionist/sort-decorators": "warn",
      "perfectionist/sort-enums": ["warn", { partitionByComment: true }],
      "perfectionist/sort-exports": "warn",
      "perfectionist/sort-heritage-clauses": "warn",
      "perfectionist/sort-imports": ["warn", importOptions],
      "perfectionist/sort-interfaces": "warn",
      "perfectionist/sort-intersection-types": "warn",
      "perfectionist/sort-maps": ["warn", { partitionByComment: true }],
      "perfectionist/sort-modules": "warn",
      "perfectionist/sort-named-exports": "warn",
      "perfectionist/sort-named-imports": "warn",
      "perfectionist/sort-objects": ["warn", { partitionByComment: true }],
      "perfectionist/sort-sets": ["warn", { partitionByComment: true }],
      "perfectionist/sort-switch-case": "warn",
      "perfectionist/sort-variable-declarations": "warn",
    },
  };
}

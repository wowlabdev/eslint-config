import type { Linter } from "eslint";

import stylistic from "@stylistic/eslint-plugin";

const prettierCompatible = stylistic.configs.customize({
  arrowParens: true,
  blockSpacing: true,
  braceStyle: "1tbs",
  commaDangle: "always-multiline",
  indent: 2,
  jsx: true,
  quoteProps: "as-needed",
  quotes: "double",
  semi: true,
  severity: "error",
});

const structuralRules: Linter.RulesRecord = {
  "@stylistic/function-call-spacing": ["error", "never"],
  "@stylistic/jsx-pascal-case": "error",
  "@stylistic/jsx-self-closing-comp": [
    "error",
    { component: true, html: true },
  ],
  "@stylistic/jsx-wrap-multilines": [
    "error",
    {
      arrow: "parens-new-line",
      assignment: "parens-new-line",
      condition: "parens-new-line",
      declaration: "parens-new-line",
      logical: "parens-new-line",
      prop: "ignore",
      propertyValue: "ignore",
      return: "parens-new-line",
    },
  ],
  "@stylistic/linebreak-style": ["error", "unix"],
  "@stylistic/lines-around-comment": [
    "error",
    {
      allowArrayEnd: true,
      allowArrayStart: true,
      allowBlockEnd: true,
      allowBlockStart: true,
      allowClassEnd: true,
      allowClassStart: true,
      allowEnumEnd: true,
      allowEnumStart: true,
      allowInterfaceEnd: true,
      allowInterfaceStart: true,
      allowModuleEnd: true,
      allowModuleStart: true,
      allowObjectEnd: true,
      allowObjectStart: true,
      allowTypeEnd: true,
      allowTypeStart: true,
      beforeBlockComment: true,
    },
  ],
  "@stylistic/no-extra-semi": "error",
  "@stylistic/nonblock-statement-body-position": ["error", "beside"],
  // prettier-ignore
  "@stylistic/padding-line-between-statements": [
    "error",
    { blankLine: "always", next: "return", prev: "*" },
    { blankLine: "always", next: "*", prev: ["const", "let", "var"] },
    { blankLine: "any", next: ["const", "let", "var"], prev: ["const", "let", "var"] },
    { blankLine: "always", next: "*", prev: "directive" },
    { blankLine: "any", next: "directive", prev: "directive" },
    { blankLine: "always", next: ["if", "for", "while", "switch", "try", "function", "class"], prev: "*" },
    { blankLine: "always", next: "*", prev: ["if", "for", "while", "switch", "try", "function", "class"] },
    { blankLine: "always", next: "block-like", prev: "block-like" },
    { blankLine: "always", next: "export", prev: "*" },
    { blankLine: "any", next: ["function", "function-overload"], prev: ["function", "function-overload"] },
    { blankLine: "any", next: "export", prev: "export" },
  ],
  "@stylistic/quotes": [
    "error",
    "double",
    { allowTemplateLiterals: "always", avoidEscape: true },
  ],
  "@stylistic/semi-style": ["error", "last"],
  "@stylistic/switch-colon-spacing": ["error", { after: true, before: false }],
};

// prettier-ignore
const prettierOwnedRules = [
  "array-bracket-newline",
  "array-element-newline",
  "curly-newline",
  "exp-jsx-props-style",
  "exp-list-style",
  "function-call-argument-newline",
  "function-paren-newline",
  "implicit-arrow-linebreak",
  "indent",
  "indent-binary-ops",
  "jsx-child-element-spacing",
  "jsx-curly-newline",
  "jsx-indent",
  "jsx-newline",
  "jsx-one-expression-per-line",
  "jsx-sort-props",
  "line-comment-position",
  "max-len",
  "multiline-comment-style",
  "multiline-ternary",
  "newline-per-chained-call",
  "no-confusing-arrow",
  "object-curly-newline",
  "object-property-newline",
  "one-var-declaration-per-line",
  "operator-linebreak",
  "wrap-regex",
];

export const stylisticConfig: Linter.Config = {
  ...prettierCompatible,
  name: "wowlab/stylistic",
  rules: {
    ...prettierCompatible.rules,
    ...structuralRules,
    ...Object.fromEntries(
      prettierOwnedRules.map((rule) => [`@stylistic/${rule}`, "off"]),
    ),
  },
};

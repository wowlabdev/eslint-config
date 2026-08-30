import type { ESLint } from "eslint";

import { functionPadding } from "./rules/function-padding.js";

export const wowlabPlugin: ESLint.Plugin = {
  rules: {
    "function-padding": functionPadding,
  },
};

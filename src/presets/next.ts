import type { Linter } from "eslint";

import nextPlugin from "@next/eslint-plugin-next";

import type { FilesOptions } from "./globals.js";

export function next({
  files = ["**/*.{js,jsx,ts,tsx,mjs,mts,cjs,cts}"],
}: FilesOptions = {}): Linter.Config[] {
  return [
    {
      ...nextPlugin.configs["core-web-vitals"],
      files,
      name: "wowlab/next/core-web-vitals",
    },
  ];
}

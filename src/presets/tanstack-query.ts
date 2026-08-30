import type { Linter } from "eslint";

import query from "@tanstack/eslint-plugin-query";

import type { FilesOptions } from "./globals.js";

export function tanstackQuery({
  files = ["**/*.{js,jsx,ts,tsx,mjs,mts,cjs,cts}"],
}: FilesOptions = {}): Linter.Config[] {
  return query.configs["flat/recommended"].map((config) => ({
    ...config,
    files,
    name: config.name?.replace("tanstack/query/", "wowlab/tanstack-query/"),
  }));
}

import type { Linter } from "eslint";

import environmentGlobals from "globals";

export interface FilesOptions {
  files?: string[];
}

export function deno({
  files = ["**/*.{js,jsx,ts,tsx,mjs,mts,cjs,cts}"],
}: FilesOptions = {}): Linter.Config[] {
  return environment("denoBuiltin", files);
}

export function node({
  files = ["**/*.{js,mjs,cjs,ts,mts,cts}"],
}: FilesOptions = {}): Linter.Config[] {
  return environment("node", files);
}

function environment(
  name: "denoBuiltin" | "node",
  files: string[],
): Linter.Config[] {
  return [
    {
      files,
      languageOptions: { globals: { ...environmentGlobals[name] } },
      name: `wowlab/globals/${name}`,
    },
  ];
}

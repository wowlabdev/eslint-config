import type { Linter } from "eslint";

import tseslint from "typescript-eslint";

import type { FilesOptions } from "./globals.js";

export interface TypeScriptOptions extends FilesOptions {
  tsconfigRootDir?: string;
  typeChecked?: boolean;
}

export function typescript({
  files = ["**/*.{ts,tsx,mts,cts}"],
  tsconfigRootDir,
  typeChecked = false,
}: TypeScriptOptions = {}): Linter.Config[] {
  const upstreamConfig = (
    typeChecked
      ? tseslint.configs.recommendedTypeChecked
      : tseslint.configs.recommended
  ) as Linter.Config[];

  return upstreamConfig.map((config) => {
    const languageOptions = config.languageOptions
      ? {
          ...config.languageOptions,
          parserOptions: {
            ...(typeChecked ? { projectService: true } : {}),
            ...(tsconfigRootDir ? { tsconfigRootDir } : {}),
          },
        }
      : undefined;

    return {
      ...config,
      files,
      ...(languageOptions ? { languageOptions } : {}),
      name: config.name?.replace("typescript-eslint/", "wowlab/typescript/"),
    };
  });
}

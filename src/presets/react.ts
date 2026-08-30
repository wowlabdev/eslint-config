import type { Linter } from "eslint";

import eslintReact from "@eslint-react/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";

import type { FilesOptions } from "./globals.js";

import { typescript as typescriptPreset } from "./typescript.js";

const JAVASCRIPT_FILES = ["**/*.{js,jsx,mjs,cjs}"];
const TYPESCRIPT_FILES = ["**/*.{ts,tsx,mts,cts}"];

export interface ReactOptions extends FilesOptions {
  tsconfigRootDir?: string;
  typeChecked?: boolean;
  typescript?: boolean;
  typescriptFiles?: string[];
}

export function react({
  files = JAVASCRIPT_FILES,
  tsconfigRootDir,
  typeChecked = false,
  typescript = false,
  typescriptFiles = TYPESCRIPT_FILES,
}: ReactOptions = {}): Linter.Config[] {
  const typescriptConfigName = typeChecked
    ? "recommended-type-checked"
    : "recommended";
  const recommendedConfig = eslintReact.configs.recommended as Linter.Config;
  const typescriptConfig = eslintReact.configs[
    typescriptConfigName
  ] as Linter.Config;
  const hooksConfig = reactHooks.configs.flat.recommended;
  const javascriptConfig: Linter.Config = {
    ...recommendedConfig,
    files,
    languageOptions: {
      ...recommendedConfig.languageOptions,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    name: "wowlab/react/recommended",
  };
  const javascriptHooksConfig: Linter.Config = {
    ...hooksConfig,
    files,
    name: "wowlab/react/hooks",
  };

  if (!typescript && !typeChecked) {
    return [javascriptConfig, javascriptHooksConfig];
  }

  return [
    javascriptConfig,
    javascriptHooksConfig,
    ...typescriptPreset({
      files: typescriptFiles,
      tsconfigRootDir,
      typeChecked,
    }),
    {
      ...typescriptConfig,
      files: typescriptFiles,
      name: `wowlab/react/typescript/${typescriptConfigName}`,
    },
    {
      ...hooksConfig,
      files: typescriptFiles,
      name: "wowlab/react/typescript/hooks",
    },
  ];
}

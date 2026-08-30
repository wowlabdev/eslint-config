import { deno, node } from "./presets/globals.js";
import { next } from "./presets/next.js";
import { react } from "./presets/react.js";
import { tanstackQuery } from "./presets/tanstack-query.js";
import { typescript } from "./presets/typescript.js";

export { type ConfigOptions, createConfig } from "./create-config.js";
export type { FilesOptions } from "./presets/globals.js";
export type { ReactOptions } from "./presets/react.js";
export type { TypeScriptOptions } from "./presets/typescript.js";

export const presets = Object.freeze({
  deno,
  next,
  node,
  react,
  tanstackQuery,
  typescript,
});

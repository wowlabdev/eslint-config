import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../fixtures/", import.meta.url);

export function fixture(name: string): Promise<string> {
  return readFile(new URL(name, root), "utf8");
}

export function fixturePath(name: string): string {
  return fileURLToPath(new URL(name, root));
}

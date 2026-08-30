import { fs, path } from "zx";

const root = path.resolve(import.meta.dirname, "..");

await fs.remove(path.join(root, "dist"));

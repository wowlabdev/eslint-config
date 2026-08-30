import { fs, path } from "zx";

const root = path.resolve(import.meta.dirname, "..");
const output = path.join(root, ".package");

export async function preparePackage(): Promise<string> {
  await fs.remove(output);
  await fs.ensureDir(output);

  await Promise.all([
    fs.copy(path.join(root, "dist"), path.join(output, "dist")),
    fs.copy(path.join(root, "LICENSE"), path.join(output, "LICENSE")),
    fs.copy(path.join(root, "README.md"), path.join(output, "README.md")),
  ]);

  const packageJson = (await fs.readJson(
    path.join(root, "package.json"),
  )) as Record<string, unknown>;

  delete packageJson.devDependencies;
  delete packageJson.packageManager;
  delete packageJson.scripts;

  await fs.writeJson(path.join(output, "package.json"), packageJson, {
    spaces: 2,
  });

  return output;
}

if (process.argv[1] === import.meta.filename) {
  await preparePackage();
}

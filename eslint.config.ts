import { createConfig, presets } from "./src/index.js";

export default createConfig({
  ignores: [".package/**", "coverage/**", "dist/**", "test/fixtures/**"],
  presets: [presets.node(), presets.typescript()],
});

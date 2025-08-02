import { defineConfig } from "eslint/config";
import raycastConfig from "@raycast/eslint-config";

export default defineConfig([
  ...raycastConfig,
  {
    ignores: [".nx/**", "dist/**", "build/**", "node_modules/**", "**/*.bundle.js", "**/*.min.js", "**/*.generated.*"]
  }
]);
